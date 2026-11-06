import { createFileRoute, Link } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { pageCanonicalHead } from "@/lib/site-seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    ...pageCanonicalHead("/terms"),
    meta: [
      { title: "Terms and conditions | USSCALLISTER" },
      {
        name: "description",
        content:
          "Terms and conditions for USSCALLISTER LLC. How a project starts, what this site is, and what a page here does not promise.",
      },
      {
        name: "keywords",
        content: "USSCALLISTER terms and conditions, studio engagement, Los Angeles web design",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Terms and conditions | USSCALLISTER" },
      {
        property: "og:description",
        content: "How an engagement with USSCALLISTER starts, and what this site does not promise.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <main className="folio">
      <FolioBar here="Terms" />
      <article className="folio-article">
        <p className="kicker-label">Terms</p>
        <h1>Terms and conditions.</h1>
        <div className="folio-prose folio-prose-solo">
          <p>USSCALLISTER LLC, Los Angeles. These terms cover use of this site.</p>
          <h2>This site</h2>
          <p>
            The site is a studio portfolio and a journal. A page, a case study, or an article is not a quote, not a
            contract, and not a promise of a ranking, a lead count, a timeline, or a result.
          </p>
          <h2>How a project starts</h2>
          <p>
            A project starts only when both sides agree on scope, fee, and schedule in writing. Until then, a
            conversation is a conversation. Either side can stop it. Work that is not written into the agreement is
            not included.
          </p>
          <h2>Projects on this site</h2>
          <p>
            Project pages describe work for clients. Names, screenshots, and links are examples of what was built.
            They are not a claim that a visitor will get the same outcome. Client sites remain the property of those
            clients. The writing and design of this studio site belong to USSCALLISTER LLC unless a page says
            otherwise.
          </p>
          <h2>Inquiries and the newsletter</h2>
          <p>
            Sending a brief or a newsletter signup is a request for a reply, not a booking. We may decline a project.
            Newsletter mail is occasional. You can leave the list by writing to usscallisterllc@gmail.com. See the{" "}
            <Link to="/privacy">privacy policy</Link> for what we keep.
          </p>
          <h2>Acceptable use</h2>
          <p>
            Do not misuse the forms, attempt to break the site, or copy the studio’s work and present it as your own.
            Links to client sites are provided for reference.
          </p>
          <h2>Liability</h2>
          <p>
            The site is offered as it is. We are not liable for decisions you make from an article or a project page,
            or for interruptions in the site. Nothing here limits a right that the law does not allow us to limit.
          </p>
          <h2>Contact</h2>
          <p>
            usscallisterllc@gmail.com · 818-913-6158 · <Link to="/newsletter">Newsletter</Link>
          </p>
        </div>
      </article>
    </main>
  );
}
