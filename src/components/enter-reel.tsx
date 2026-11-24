import { useEffect, useRef, type FormEvent } from "react";
import { useFilm } from "@/lib/use-film";
import { getLenis } from "@/lib/use-lenis";
import { TEXT_US } from "@/lib/text-us";

type EnterReelProps = {
  formNote: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function EnterReel({ formNote, onSubmit }: EnterReelProps) {
  const sent = formNote.startsWith("Message has been sent");
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  useFilm(videoRef, "close");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const copy = root.querySelector<HTMLElement>(".close-copy");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const apply = () => {
      if (reduced.matches) {
        root.style.setProperty("--gap", "0");
        root.classList.add("is-lit");
        return;
      }
      const rect = root.getBoundingClientRect();
      const total = root.offsetHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const t = total > 0 ? passed / total : 1;
      const width = t >= 0.985 ? 0 : 100 * (1 - t);
      root.style.setProperty("--gap", width.toFixed(2));
      const band = (width / 100) * window.innerWidth;
      const writing = (copy?.offsetWidth ?? 420) + 28;
      root.classList.toggle("is-lit", band < writing);
      const onStage = rect.top < window.innerHeight * 0.2 && rect.bottom > 80;
      document.body.classList.toggle("close-live", onStage && !reduced.matches);
    };

    apply();
    const onScroll = () => apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const lenis = getLenis();
    lenis?.on("scroll", onScroll);
    reduced.addEventListener("change", apply);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      lenis?.off("scroll", onScroll);
      reduced.removeEventListener("change", apply);
      document.body.classList.remove("close-live");
    };
  }, []);

  return (
    <section className="close" id="reel" aria-label="Contact" ref={rootRef}>
      <div className="close-pin">
        <img className="close-poster" src="/media/close-poster.jpg?v=4" alt="" />
        <video
          className="close-still"
          autoPlay
          muted
          loop
          playsInline
          poster="/media/close-poster.jpg?v=4"
          preload="none"
          ref={videoRef}
          onPlaying={(event) => event.currentTarget.classList.add("is-on")}
        />
        <div className="close-shade" aria-hidden="true" />
        <div className="close-band" aria-hidden="true" />
        <div className="close-center">
          <div className="close-copy">
            <p>Contact</p>
            <h2>Tell us.</h2>
            <p className="close-lead">A name and a note. We take it from there.</p>
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
                  <textarea name="brief" rows={3} placeholder="What should the site do?" suppressHydrationWarning />
                </label>
                <button className="send" type="submit">
                  Send the brief
                </button>
                <p className="form-note">
                  <a className="text-us" href={TEXT_US}>
                    Text us
                  </a>
                </p>
                {formNote ? <p className="form-note">{formNote}</p> : null}
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
