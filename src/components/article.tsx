import { Link } from "@tanstack/react-router";
import { useEffect, useRef, type ReactNode } from "react";
import type { JournalEntry } from "@/content/journal-types";
import { journal } from "@/content/journal";
import { headingId, imageSrcSet, readingMinutes } from "@/lib/journal-seo";

function rewrite(href: string) {
  if (href === "/contact" || href === "/contact/") return "/#contact";
  if (href === "/services" || href === "/services/") return "/#info";
  const blog = href.match(/^\/blog\/([a-z0-9-]+)\/?$/);
  if (blog) return `/journal/${blog[1]}`;
  return href;
}

function Rich({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const href = rewrite(match[2]);
    const slug = href.match(/^\/journal\/([a-z0-9-]+)\/?$/)?.[1];
    if (slug && journal.some((entry) => entry.slug === slug)) {
      nodes.push(
        <Link key={match.index} to="/journal/$slug" params={{ slug }}>
          {match[1]}
        </Link>,
      );
    } else if (href.startsWith("/web-design-los-angeles")) {
      nodes.push(
        <Link key={match.index} to="/web-design-los-angeles">
          {match[1]}
        </Link>,
      );
    } else if (/^(\/|#|https:\/\/|mailto:)/.test(href)) {
      nodes.push(
        <a key={match.index} href={href}>
          {match[1]}
        </a>,
      );
    } else nodes.push(match[1]);
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

export function FolioBar({ here }: { here: string }) {
  return (
    <header className="folio-bar">
      <a href="/">USSCALLISTER</a>
      <nav aria-label="Journal">
        <Link to="/journal">Journal</Link>
        <span aria-hidden="true">/</span>
        <span>{here}</span>
      </nav>
    </header>
  );
}

export function ArticleView({ entry }: { entry: JournalEntry }) {
  const article = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const root = article.current;
      if (!root || !bar.current) return;
      const total = Math.max(1, root.offsetHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / total));
      bar.current.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [entry.slug]);

  const blocks =
    entry.blocks[0]?.type === "p" && entry.blocks[0].text.trim() === entry.standfirst.trim()
      ? entry.blocks.slice(1)
      : entry.blocks;
  const headings = blocks.filter((block) => block.type === "h2");
  const related = (entry.relatedSlugs ?? [])
    .map((slug) => journal.find((item) => item.slug === slug))
    .filter((item): item is JournalEntry => Boolean(item));
  const updated = entry.dateModified
    ? new Date(`${entry.dateModified}T12:00:00Z`).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : entry.date;

  return (
    <article ref={article} className="folio-article">
      <div ref={bar} className="folio-progress" style={{ transform: "scaleX(0)" }} aria-hidden="true" />
      <figure className="folio-hero">
        <img
          src={entry.image}
          srcSet={imageSrcSet(entry.image)}
          sizes="100vw"
          alt={entry.imageAlt}
          width={entry.imageWidth ?? 1600}
          height={entry.imageHeight ?? 900}
          decoding="async"
        />
        {entry.imageCaption ? <figcaption>{entry.imageCaption}</figcaption> : null}
      </figure>
      <p className="kicker-label">
        {entry.category ?? "Journal"} · {readingMinutes(entry)} min
      </p>
      <h1>{entry.title}</h1>
      <p className="folio-byline">
        {entry.author ?? "USSCALLISTER"} · {updated}
      </p>
      <p className="folio-stand">{entry.standfirst}</p>
      <div className="folio-layout">
        {headings.length > 0 ? (
          <nav className="folio-toc" aria-label="In this note">
            <p>In this note</p>
            <ol>
              {headings.map((heading) => {
                const index = blocks.indexOf(heading);
                const id = `${headingId(heading.text)}-${index}`;
                return (
                  <li key={id}>
                    <a href={`#${id}`}>{heading.text}</a>
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}
        <div className="folio-prose">
          {blocks.map((block, index) => {
            if (block.type === "h2") {
              return (
                <h2 id={`${headingId(block.text)}-${index}`} key={index}>
                  {block.text}
                </h2>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={index}>
                  {block.items.map((item) => (
                    <li key={item}>
                      <Rich text={item} />
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={index}>
                <Rich text={block.text} />
              </p>
            );
          })}
          <aside className="folio-next">
            <p>Start a project</p>
            <a href="/#contact">Send a brief</a>
            <a href="/projects">See the projects</a>
          </aside>
        </div>
      </div>
      {related.length > 0 ? (
        <section className="folio-related" aria-label="Related notes">
          <p className="kicker-label">Continue</p>
          <div className="journal-grid">
            {related.map((item) => (
              <Link key={item.slug} to="/journal/$slug" params={{ slug: item.slug }} className="note">
                <figure className="note-media">
                  <img src={item.image} alt={item.imageAlt} width={1600} height={900} loading="lazy" decoding="async" />
                </figure>
                <h3>{item.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
