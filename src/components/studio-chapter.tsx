import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { FolioBar } from "@/components/article";
import { SiteCheck } from "@/components/site-check";
import "./studio-chapter.css";

const SERVICES = [
  { to: "/web-design-medical-clinics", label: "Medical clinics" },
  { to: "/web-design-roofing-contractors", label: "Roofing" },
  { to: "/web-design-plumbing-contractors", label: "Plumbing" },
  { to: "/web-design-airbnb-cleaning", label: "Cleaning" },
] as const;

export function StudioChapter({ bar = false }: { bar?: boolean }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revert: (() => void) | undefined;
    let cancelled = false;

    void (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.from(".studio-line", {
          y: 28,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".studio-lead", start: "top 78%" },
        });
        gsap.from(".studio-row", {
          y: 16,
          opacity: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: ".studio-rows", start: "top 80%" },
        });
      }, root);
      revert = () => ctx.revert();
    })();

    return () => {
      cancelled = true;
      revert?.();
    };
  }, []);

  return (
    <article className="studio-chapter" ref={rootRef}>
      {bar ? <FolioBar here="Info" /> : null}
      <div className="studio-lead">
        <p className="studio-kicker">The studio · Los Angeles</p>
        <h2 className="studio-line">We study the click</h2>
        <h2 className="studio-line">before we draw the page.</h2>
        <p className="studio-copy">
          USSCALLISTER is a Los Angeles studio built on conversion. Before a single pixel ships, we research the
          audience and the path from first visit to action. That is why the sites for clinics, contractors, and home
          services do more than look right.
        </p>
        <dl className="studio-facts">
          <div>
            <dt>Practice</dt>
            <dd>Websites for clinics, roofing, plumbing, and cleaning.</dd>
          </div>
          <div>
            <dt>Method</dt>
            <dd>Research first. Then the page, then the call.</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>
              <a href="tel:8189136158">818-913-6158</a>
            </dd>
          </div>
          <div>
            <dt>Mail</dt>
            <dd>
              <a href="mailto:usscallisterllc@gmail.com">usscallisterllc@gmail.com</a>
            </dd>
          </div>
        </dl>
      </div>
      <ol className="studio-rows">
        {SERVICES.map((service, index) => (
          <li key={service.to} className="studio-row">
            <Link to={service.to}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {service.label}
            </Link>
          </li>
        ))}
      </ol>
      <div className="studio-score">
        <SiteCheck />
        <Link className="studio-brief" to="/contact">
          Start a brief
        </Link>
      </div>
    </article>
  );
}
