import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { getLenis } from "@/lib/use-lenis";
import "./distort-hero.css";

const vertex = `attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision mediump float;varying vec2 uv;uniform sampler2D film;uniform vec2 screen;uniform vec2 source;uniform vec2 pointer;uniform float power;uniform float time;vec2 cover(vec2 p){float a=screen.x/screen.y;float b=source.x/source.y;if(a>b)p.y=(p.y-.5)*b/a+.5;else p.x=(p.x-.5)*a/b+.5;return p;}void main(){vec2 p=uv;vec2 d=p-pointer;d.x*=screen.x/screen.y;float r=length(d);float wave=sin(r*18.-time*3.)*exp(-r*2.8)*power*.045;p+=normalize(d+vec2(.0001))*wave;p.x+=sin(p.y*8.+time)*power*.018;vec2 c=cover(p);float shift=power*.013*exp(-r);float red=texture2D(film,c+vec2(shift,0.)).r;float green=texture2D(film,c).g;float blue=texture2D(film,c-vec2(shift,0.)).b;gl_FragColor=vec4(red,green,blue,1.);}`;

function enterWork(event: { preventDefault: () => void }) {
  event.preventDefault();
  const target = document.getElementById("index");
  const lenis = getLenis();
  if (lenis && target) lenis.scrollTo(target);
  else target?.scrollIntoView({ behavior: "auto" });
}

export function DistortHero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const holdRef = useRef<HTMLButtonElement>(null);
  const pauseRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    const hold = holdRef.current;
    const pause = pauseRef.current;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    if (!hero || !video || !hold || !pause || !dialog || !trigger) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const point = { x: 0.5, y: 0.5 };
    let active = false;
    let userPaused = reduced.matches;
    let started = false;
    let dead = false;
    let frame = 0;

    const play = () => {
      if (!video.getAttribute("src")) video.src = "/media/distort-hero.mp4";
      void video.play().catch(() => {});
    };
    const end = () => {
      active = false;
      hero.classList.remove("is-pressed");
      const label = hold.lastElementChild;
      if (label) label.textContent = reduced.matches ? "Reduced motion" : "Hold to bend reality";
    };
    const start = () => {
      if (reduced.matches) return;
      active = true;
      hero.classList.add("is-pressed");
      const label = hold.lastElementChild;
      if (label) label.textContent = "Reality, reworked.";
      if (!started) {
        started = true;
        initLens();
      }
    };

    const onPlay = () => {
      pause.textContent = "Pause film Ⅱ";
      pause.setAttribute("aria-label", "Pause background film");
    };
    const onPause = () => {
      pause.textContent = "Play film ▷";
      pause.setAttribute("aria-label", "Play background film");
    };
    const onPauseClick = () => {
      userPaused = !video.paused;
      if (video.paused) play();
      else video.pause();
    };
    const onDown = (event: PointerEvent) => {
      hold.setPointerCapture(event.pointerId);
      start();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        start();
      }
    };
    const onMove = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      point.x = (event.clientX - rect.left) / rect.width;
      point.y = (event.clientY - rect.top) / rect.height;
      if (!reduced.matches) {
        hero.style.setProperty("--mx", `${(point.x - 0.5) * 12}px`);
        hero.style.setProperty("--my", `${(point.y - 0.5) * 12}px`);
      }
    };
    const onVisible = () => {
      if (document.hidden) {
        video.pause();
        end();
      } else if (!userPaused && !reduced.matches) play();
    };
    const motion = () => {
      hold.disabled = reduced.matches;
      if (reduced.matches) {
        userPaused = true;
        video.pause();
        end();
      }
    };
    const closeMenu = () => {
      dialog.close();
      trigger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      trigger.focus();
    };
    const openMenu = () => {
      dialog.showModal();
      trigger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };
    const onCancel = (event: Event) => {
      event.preventDefault();
      closeMenu();
    };

    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    pause.addEventListener("click", onPauseClick);
    hold.addEventListener("pointerdown", onDown);
    hold.addEventListener("pointerup", end);
    hold.addEventListener("pointercancel", end);
    hold.addEventListener("blur", end);
    hold.addEventListener("keydown", onKeyDown);
    hold.addEventListener("keyup", end);
    window.addEventListener("pointerup", end);
    window.addEventListener("blur", end);
    hero.addEventListener("pointermove", onMove);
    document.addEventListener("visibilitychange", onVisible);
    reduced.addEventListener("change", motion);
    trigger.addEventListener("click", openMenu);
    dialog.addEventListener("cancel", onCancel);
    const closeButton = dialog.querySelector("button");
    closeButton?.addEventListener("click", closeMenu);
    dialog.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

    if (!reduced.matches) play();
    else pause.textContent = "Play film ▷";
    motion();

    function initLens() {
      const film = hero.querySelector(".x-film");
      const shade = hero.querySelector(".x-film-shade");
      if (!film || !shade) return;
      const canvas = document.createElement("canvas");
      canvas.className = "x-lens";
      canvas.setAttribute("aria-hidden", "true");
      film.insertBefore(canvas, shade);
      const gl = canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power" });
      if (!gl) return;
      const shader = (type: number, source: string) => {
        const item = gl.createShader(type);
        if (!item) throw new Error("Shader unavailable");
        gl.shaderSource(item, source);
        gl.compileShader(item);
        if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) throw new Error("Shader unavailable");
        return item;
      };
      try {
        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
        gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const pos = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        const uniform = (name: string) => gl.getUniformLocation(program, name);
        const screen = uniform("screen");
        const source = uniform("source");
        const pointer = uniform("pointer");
        const power = uniform("power");
        const time = uniform("time");
        const resize = new ResizeObserver(() => {
          canvas.width = Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 1.5));
          canvas.height = Math.round(canvas.clientHeight * Math.min(devicePixelRatio, 1.5));
          gl.viewport(0, 0, canvas.width, canvas.height);
        });
        resize.observe(canvas);
        let strength = 0;
        let lost = false;
        canvas.addEventListener("webglcontextlost", () => {
          lost = true;
          canvas.style.opacity = "0";
        });
        const draw = (t: number) => {
          if (dead || lost) return;
          frame = requestAnimationFrame(draw);
          if (document.hidden) return;
          strength += (Number(active) - strength) * 0.09;
          if (strength < 0.002) {
            canvas.style.opacity = "0";
            return;
          }
          if (video.readyState < 2) return;
          try {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
          } catch {
            return;
          }
          gl.uniform2f(screen, canvas.width, canvas.height);
          gl.uniform2f(source, video.videoWidth, video.videoHeight);
          gl.uniform2f(pointer, point.x, 1 - point.y);
          gl.uniform1f(power, strength);
          gl.uniform1f(time, t * 0.001);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
          canvas.style.opacity = String(Math.min(1, strength * 4));
        };
        frame = requestAnimationFrame(draw);
      } catch {
        canvas.remove();
      }
    }

    return () => {
      dead = true;
      cancelAnimationFrame(frame);
      video.pause();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      pause.removeEventListener("click", onPauseClick);
      hold.removeEventListener("pointerdown", onDown);
      hold.removeEventListener("pointerup", end);
      hold.removeEventListener("pointercancel", end);
      hold.removeEventListener("blur", end);
      hold.removeEventListener("keydown", onKeyDown);
      hold.removeEventListener("keyup", end);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("blur", end);
      hero.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisible);
      reduced.removeEventListener("change", motion);
      trigger.removeEventListener("click", openMenu);
      dialog.removeEventListener("cancel", onCancel);
      closeButton?.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <div className="distort-hero">
      <header className="x-nav">
        <a className="x-brand" href="#home" aria-label="USSCALLISTER home">
          USS<span>CALLISTER</span>
          <sup>™</sup>
        </a>
        <span className="x-nav-studio">
          Independent digital studio
          <br />
          Los Angeles, CA
        </span>
        <nav aria-label="Primary">
          <Link to="/projects">
            Work <sup>06</sup>
          </Link>
          <Link to="/contact">
            Let’s talk <span>↗</span>
          </Link>
        </nav>
        <button ref={triggerRef} className="x-menu-trigger" type="button" aria-label="Open navigation" aria-haspopup="dialog" aria-expanded="false">
          <i />
          <i />
        </button>
      </header>
      <dialog ref={dialogRef} className="x-menu" aria-label="Navigation">
        <div className="x-menu-top">
          <span>USSCALLISTER / LOS ANGELES</span>
          <button type="button">Close ×</button>
        </div>
        <nav>
          <a href="#home">
            <small>01</small>
            <span>Home</span>
            <span>↗</span>
          </a>
          <Link to="/projects">
            <small>02</small>
            <span>Work</span>
            <span>↗</span>
          </Link>
          <Link to="/journal">
            <small>03</small>
            <span>Journal</span>
            <span>↗</span>
          </Link>
          <Link to="/contact">
            <small>04</small>
            <span>Contact</span>
            <span>↗</span>
          </Link>
        </nav>
        <div className="x-menu-foot">
          <p>Design. Development. Digital experiences.</p>
          <a href="mailto:usscallisterllc@gmail.com">usscallisterllc@gmail.com ↗</a>
        </div>
      </dialog>
      <section className="x-hero" ref={heroRef} aria-label="Hold to bend reality">
        <div className="x-film">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster="/media/distort-poster.jpg"
            aria-label="Studio visual film"
          />
          <div className="x-film-shade" />
        </div>
        <div className="x-hero-top">
          <span>DESIGN + CODE + MOTION</span>
          <span className="x-live-dot">Independent. Unconventional.</span>
        </div>
        <div className="x-hero-title">
          <p>We build websites.</p>
          <h1>
            <span>MAKE IT</span>
            <span className="x-outline">UNREAL.</span>
          </h1>
        </div>
        <div className="x-hero-bottom">
          <a className="x-explore" href="#index" onClick={enterWork}>
            <span className="x-orbit-arrow">↙</span>
            <span>
              Explore the work
              <br />
              <small>Scroll to enter</small>
            </span>
          </a>
          <button ref={holdRef} className="x-distort" type="button" aria-label="Hold to distort the film">
            <span className="x-press-icon">◎</span>
            <span>Hold to bend reality</span>
          </button>
          <button ref={pauseRef} className="x-film-pause" type="button" aria-label="Pause background film">
            Pause film Ⅱ
          </button>
        </div>
        <span className="x-edge-label" aria-hidden="true">
          USSC / DIGITAL / 2026
        </span>
      </section>
    </div>
  );
}
