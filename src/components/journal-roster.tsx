import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type AnimationEvent, type KeyboardEvent, type MouseEvent } from "react";
import { journal as allJournal } from "@/content/journal";
import type { JournalEntry } from "@/content/journal-types";
import { imageSrcSet, readingMinutes } from "@/lib/journal-seo";
import { useParallax } from "@/lib/parallax";

type JournalRosterProps = {
  entries?: JournalEntry[];
};

function RollText({ text, on }: { text: string; on: boolean }) {
  const words = text.split(" ");
  let step = 0;
  return (
    <span className={on ? "roll is-on" : "roll"}>
      {words.map((word, wordIndex) => (
        <span key={`${wordIndex}-${word}`}>
          <span className="roll-word">
            {Array.from(word).map((char, charIndex) => {
              const delay = Math.min(step, 28) * 18;
              step += 1;
              return (
                <span className="roll-char" key={charIndex} style={{ transitionDelay: on ? `${delay}ms` : "0ms" }}>
                  <span className="roll-mover">
                    <span>{char}</span>
                    <span aria-hidden="true">{char}</span>
                  </span>
                </span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

function Thumb({ src }: { src: string }) {
  const shot = useParallax<HTMLImageElement>(0.03);
  return (
    <span className="roster-thumb">
      <img ref={shot.ref} style={shot.style} src={src} alt="" width={1200} height={800} />
    </span>
  );
}

function RowBody({
  entry,
  number,
  on,
  minutes,
}: {
  entry: JournalEntry;
  number: number;
  on: boolean;
  minutes: number;
}) {
  return (
    <>
      <span className="roster-num">{String(number).padStart(2, "0")}</span>
      <span className="roster-main">
        <span className="roster-title">
          <RollText text={entry.title} on={on} />
        </span>
        <span className="roster-meta">
          {entry.category ?? "Journal"} · {minutes} min
        </span>
      </span>
      <Thumb src={entry.image} />
    </>
  );
}

export function JournalRoster({ entries = allJournal }: JournalRosterProps) {
  const categories = Array.from(new Set(entries.map((entry) => entry.category ?? "Journal")));
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(entries[0]?.slug ?? "");
  const [base, setBase] = useState(entries[0]?.slug ?? "");
  const [cover, setCover] = useState<string | null>(null);
  const [play, setPlay] = useState(false);
  const [reduce, setReduce] = useState(false);
  const plate = useParallax<HTMLDivElement>(0.02);
  const token = useRef(0);
  const coverRef = useRef<string | null>(null);
  coverRef.current = cover;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const visible = entries.filter((entry) => filter === "All" || (entry.category ?? "Journal") === filter);
  const current = visible.find((entry) => entry.slug === selected) ?? visible[0];

  const reveal = (slug: string) => {
    setSelected(slug);
    if (reduce) {
      token.current += 1;
      setBase(slug);
      setCover(null);
      setPlay(false);
      return;
    }
    if (slug === base && cover === null) return;
    if (slug === cover) return;
    const id = token.current + 1;
    token.current = id;
    setCover(slug);
    setPlay(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (token.current === id) setPlay(true);
      });
    });
  };

  const onWipeEnd = (event: AnimationEvent<HTMLImageElement>) => {
    if (event.animationName !== "roster-wipe") return;
    const slug = event.currentTarget.dataset.slug;
    if (!slug || slug !== coverRef.current || event.currentTarget.dataset.token !== String(token.current)) return;
    setBase(slug);
    setCover(null);
    setPlay(false);
  };

  const onRowClick = (event: MouseEvent, slug: string) => {
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (slug !== selected) {
      event.preventDefault();
      reveal(slug);
    }
  };

  const onListKey = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    if (!current) return;
    const index = visible.findIndex((entry) => entry.slug === current.slug);
    const next = visible[event.key === "ArrowDown" ? Math.min(index + 1, visible.length - 1) : Math.max(index - 1, 0)];
    if (!next || next.slug === current.slug) return;
    event.preventDefault();
    reveal(next.slug);
    const row = document.getElementById(`roster-${next.slug}`);
    const target = Array.from(row?.querySelectorAll<HTMLElement>("a.roster-row, button.roster-tap") ?? []).find(
      (node) => node.getClientRects().length > 0,
    );
    target?.focus();
  };

  if (!current) return null;

  const shown = cover ?? base;

  return (
    <div className="roster">
      <header className="roster-head">
        <h1>Journal</h1>
        <p className="roster-count">
          <span>{String(visible.length).padStart(2, "0")}</span>
          <span className="roster-count-label"> articles</span>
        </p>
      </header>
      <div className="roster-filters" role="toolbar" aria-label="Filter articles">
        {["All", ...categories].map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={filter === category}
            onClick={() => {
              setFilter(category);
              const next = entries.filter((entry) => category === "All" || (entry.category ?? "Journal") === category);
              if (next[0] && !next.some((entry) => entry.slug === selected)) reveal(next[0].slug);
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="roster-stage">
        <ul className="roster-list" onKeyDown={onListKey}>
          {visible.map((entry) => {
            const on = entry.slug === current.slug;
            const number = entries.findIndex((item) => item.slug === entry.slug) + 1;
            const minutes = readingMinutes(entry);
            return (
              <li key={entry.slug} id={`roster-${entry.slug}`} className={on ? "roster-item is-on" : "roster-item"}>
                <Link
                  className={on ? "roster-row is-on" : "roster-row"}
                  to="/journal/$slug"
                  params={{ slug: entry.slug }}
                  onMouseEnter={() => reveal(entry.slug)}
                  onFocus={() => reveal(entry.slug)}
                  onClick={(event) => onRowClick(event, entry.slug)}
                >
                  <RowBody entry={entry} number={number} on={on} minutes={minutes} />
                </Link>
                <button
                  className={on ? "roster-tap is-on" : "roster-tap"}
                  type="button"
                  aria-pressed={on}
                  onClick={() => reveal(entry.slug)}
                  onFocus={() => reveal(entry.slug)}
                >
                  <RowBody entry={entry} number={number} on={on} minutes={minutes} />
                </button>
                <Link className="roster-tap-read" to="/journal/$slug" params={{ slug: entry.slug }}>
                  Read
                </Link>
              </li>
            );
          })}
        </ul>
        <aside className="roster-visual">
          <div ref={plate.ref} className="roster-plate-drift" style={plate.style}>
          <Link
            className="roster-plate"
            to="/journal/$slug"
            params={{ slug: current.slug }}
            aria-label={current.title}
          >
            {entries.map((entry) => {
              const role = entry.slug === cover ? "cover" : entry.slug === base ? "base" : "idle";
              return (
                <img
                  key={entry.slug}
                  className={
                    role === "cover"
                      ? play
                        ? "roster-shot is-cover is-play"
                        : "roster-shot is-cover"
                      : role === "base"
                        ? "roster-shot is-base"
                        : "roster-shot"
                  }
                  src={entry.image}
                  srcSet={imageSrcSet(entry.image)}
                  sizes="(max-width: 800px) calc(100vw - 40px), 42vw"
                  alt={entry.slug === shown ? entry.imageAlt : ""}
                  width={1600}
                  height={900}
                  data-slug={entry.slug}
                  data-token={role === "cover" ? String(token.current) : undefined}
                  decoding="async"
                  loading={role === "cover" ? "eager" : "lazy"}
                  onAnimationEnd={role === "cover" ? onWipeEnd : undefined}
                />
              );
            })}
          </Link>
          </div>
          <p className="roster-dek">{current.description}</p>
          <Link className="roster-read" to="/journal/$slug" params={{ slug: current.slug }}>
            Read article
          </Link>
        </aside>
      </div>
    </div>
  );
}
