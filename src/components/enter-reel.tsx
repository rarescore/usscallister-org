import { useRef, type FormEvent } from "react";
import { useFilm } from "@/lib/use-film";

type EnterReelProps = {
  formNote: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function EnterReel({ formNote, onSubmit }: EnterReelProps) {
  const sent = formNote.startsWith("Message has been sent");
  const videoRef = useRef<HTMLVideoElement>(null);
  useFilm(videoRef, "close");

  return (
    <section className="close" id="reel" aria-label="Contact">
      <video
        className="close-still"
        autoPlay
        muted
        loop
        playsInline
        poster="/media/close-poster.jpg?v=4"
        preload="none"
        ref={videoRef}
      />
      <div className="close-shade close-shade-heavy" />
      <div className="close-grid close-grid-stacked">
        <div className="close-copy">
          <p>Contact</p>
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
