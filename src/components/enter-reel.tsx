import type { FormEvent } from "react";

type EnterReelProps = {
  formNote: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function EnterReel({ formNote, onSubmit }: EnterReelProps) {
  const sent = formNote.startsWith("Message has been sent");

  return (
    <section className="close" id="reel" aria-label="Contact">
      <video
        className="close-still"
        autoPlay
        muted
        loop
        playsInline
        poster="/media/close-poster.jpg"
        preload="metadata"
      >
        <source src="/media/close.mp4" type="video/mp4" />
      </video>
      <div className="close-shade" />
      <div className="close-grid">
        <div className="close-copy">
          <p>Contact</p>
          <h2>Our website connects you with the universe.</h2>
          <p className="close-lead">
            It starts with a simple message. Tell us what you want to build, and we will take it from there.
          </p>
        </div>
        <form className="close-form" id="contact" onSubmit={onSubmit}>
          {sent ? (
            <p className="sent-note" role="status">
              Message has been sent.
            </p>
          ) : (
            <>
              <h2>Get in touch with us</h2>
              <p className="close-form-note">Name, a way to reach you, and what you want made.</p>
              <input className="trap" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <div className="close-row">
                <label>
                  Name
                  <input name="name" type="text" autoComplete="name" required suppressHydrationWarning />
                </label>
                <label>
                  Email
                  <input name="email" type="email" autoComplete="email" required suppressHydrationWarning />
                </label>
              </div>
              <label>
                Phone
                <input name="phone" type="tel" autoComplete="tel" suppressHydrationWarning />
              </label>
              <label>
                Notes
                <textarea name="brief" rows={4} suppressHydrationWarning />
              </label>
              <button className="send" type="submit">
                Send
              </button>
              {formNote ? <p className="form-note">{formNote}</p> : null}
            </>
          )}
        </form>
      </div>
    </section>
  );
}
