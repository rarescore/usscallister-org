import { createFileRoute } from "@tanstack/react-router";

const WORK = [
  {
    label: "Healthcare",
    href: "https://puravidacc.org",
    image: "/sites/canby.jpg?v=2",
  },
  {
    label: "Plumbing",
    href: "https://rooter-plumber.com",
    image: "/sites/rooter.jpg?v=2",
  },
  {
    label: "Roofing",
    href: "https://citiumroofing.com",
    image: "/sites/citium.jpg?v=2",
  },
] as const;

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Your website's new | USSCALLISTER" },
      {
        name: "description",
        content: "Most sites look finished and still lose the call. Tell us your name and phone.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="lp">
      <style>{css}</style>
      <video
        className="lp-video"
        src="/media/soccer.mp4"
        poster="/media/soccer-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="lp-shade" />
      <div className="lp-stage">
        <div className="lp-col">
          <h1>Your website's new. It's still not working.</h1>
          <p className="lp-sub">Most sites look finished and still lose the call.</p>
          <form
            className="lp-form"
            name="landing-leads"
            method="POST"
            action="/landing-thanks.html"
            netlify=""
          >
              <input type="hidden" name="form-name" value="landing-leads" />
              <label className="lp-sr" htmlFor="lp-name">
                Name
              </label>
              <input
                id="lp-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="your name"
                required
              />
              <label className="lp-sr" htmlFor="lp-phone">
                Phone
              </label>
              <input
                id="lp-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="your phone"
                required
              />
              <label className="lp-sr" htmlFor="lp-email">
                Email
              </label>
              <input
                id="lp-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="your email"
              />
              <button type="submit">Build my website</button>
            </form>
          <div className="lp-work">
            {WORK.map((item) => (
              <a key={item.label} className="lp-card" href={item.href} target="_blank" rel="noreferrer">
                <img src={item.image} alt="" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

const css = `
.lp {
  min-height: 100vh;
  color: #fff;
  font-family: Inter, sans-serif;
  letter-spacing: 0;
}
.lp-video {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
  z-index: 0;
}
.lp-shade {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
  pointer-events: none;
}
.lp-stage {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  box-sizing: border-box;
}
.lp-col {
  width: min(640px, 100%);
  text-align: center;
}
.lp h1 {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 500;
  font-size: 40px;
  line-height: 1.05;
  color: #fff;
  letter-spacing: 0;
}
.lp-sub {
  margin: 16px 0 0;
  font-family: Inter, sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.45;
  color: #b8b8b8;
}
.lp-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  margin-top: 32px;
  text-align: left;
}
.lp-form input {
  width: 100%;
  box-sizing: border-box;
  background: #111111;
  border: 1px solid #333333;
  border-radius: 4px;
  padding: 12px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  line-height: 1.3;
  color: #fff;
  letter-spacing: 0;
  outline: none;
  appearance: none;
}
.lp-form input::placeholder {
  color: #666666;
  opacity: 1;
}
.lp-form input:focus {
  border-color: #c4a574;
}
.lp-form button {
  width: 100%;
  margin: 0;
  background: #c4a574;
  color: #000;
  border: 0;
  border-radius: 4px;
  padding: 12px 24px;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  cursor: pointer;
}
.lp-form button:disabled {
  cursor: wait;
  opacity: 0.7;
}
.lp-confirm {
  margin: 32px 0 0;
  font-family: Inter, sans-serif;
  font-size: 16px;
  line-height: 1.45;
  color: #fff;
}
.lp-work {
  display: flex;
  gap: 12px;
  margin-top: 48px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  text-align: left;
}
.lp-card {
  flex: 0 0 72%;
  scroll-snap-align: start;
  color: inherit;
  text-decoration: none;
}
.lp-card img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
  background: #111;
}
.lp-card span {
  display: block;
  margin-top: 8px;
  font-family: Inter, sans-serif;
  font-size: 13px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #b8b8b8;
}
.lp-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
@media (min-width: 640px) {
  .lp h1 {
    font-size: 64px;
  }
  .lp-form button {
    width: auto;
    align-self: center;
  }
  .lp-card {
    flex-basis: 200px;
  }
}
`;
