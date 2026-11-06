import { createFileRoute, Link } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { pageCanonicalHead } from "@/lib/site-seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    ...pageCanonicalHead("/privacy"),
    meta: [
      { title: "Privacy policy | USSCALLISTER" },
      {
        name: "description",
        content:
          "Privacy policy for USSCALLISTER LLC. What we collect from project inquiries, calls, and the newsletter, how we use it, and how to ask us to delete it.",
      },
      {
        name: "keywords",
        content: "USSCALLISTER privacy policy, Los Angeles studio, project inquiry, newsletter",
      },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Privacy policy | USSCALLISTER" },
      {
        property: "og:description",
        content: "How USSCALLISTER handles inquiries, calls, and newsletter signups.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="folio">
      <FolioBar here="Privacy" />
      <article className="folio-article">
        <p className="kicker-label">Privacy</p>
        <h1>Privacy policy.</h1>
        <div className="folio-prose folio-prose-solo">
          <p>USSCALLISTER LLC, Los Angeles. This policy covers usscallister.org and this studio site.</p>
          <h2>What we collect</h2>
          <p>
            If you write through the contact form, we receive the name, email, phone number, and project note you send. If you call
            818-913-6158, we receive the number you call from and whatever you choose to say. If you sign up for the
            newsletter, we receive the email address you submit.
          </p>
          <h2>How we use it</h2>
          <p>
            We use that information to reply and to discuss a project. If you sign up for the newsletter, we may email
            that address with studio notes and promotions, including new work, offers, and updates. We do not sell the
            address, and we do not share it with advertisers. A message may sit in our email so we can find the thread
            later. You can ask us to stop by writing to usscallisterllc@gmail.com.
          </p>
          <h2>How long we keep it</h2>
          <p>
            We keep a conversation while a project is active and for a reasonable time after, so we can answer a
            follow-up. Ask us to delete a note or an email and we will, unless we have to keep a record for a legal
            reason.
          </p>
          <h2>This site</h2>
          <p>
            Pages are served so the site can load. We do not run a third-party advertising tracker. Your browser may
            store its own cache. The contact and newsletter forms deliver the message to usscallisterllc@gmail.com.
            A mail service carries that message. We do not keep a separate copy on the website.
          </p>
          <h2>Contact</h2>
          <p>
            Privacy questions go to usscallisterllc@gmail.com. Related pages: <Link to="/terms">Terms</Link>
            {" · "}
            <Link to="/newsletter">Newsletter</Link>.
          </p>
        </div>
      </article>
    </main>
  );
}
