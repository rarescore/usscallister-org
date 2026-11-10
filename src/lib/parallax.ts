import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

const EASE = 0.15;
const CAP = 0.03;

type Listener = (x: number, y: number) => void;

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let frame = 0;
let listening = false;
const listeners = new Set<Listener>();

function allowMotion() {
  return (
    !window.matchMedia("(hover: none)").matches &&
    !window.matchMedia("(pointer: coarse)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function onMove(event: MouseEvent) {
  const width = window.innerWidth || 1;
  const height = window.innerHeight || 1;
  targetX = Math.max(-1, Math.min(1, (event.clientX / width) * 2 - 1));
  targetY = Math.max(-1, Math.min(1, (event.clientY / height) * 2 - 1));
}

function tick() {
  currentX += (targetX - currentX) * EASE;
  currentY += (targetY - currentY) * EASE;
  listeners.forEach((listener) => listener(currentX, currentY));
  frame = window.requestAnimationFrame(tick);
}

function start() {
  if (listening || !allowMotion()) return;
  listening = true;
  window.addEventListener("mousemove", onMove, { passive: true });
  frame = window.requestAnimationFrame(tick);
}

function stop() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("mousemove", onMove);
  window.cancelAnimationFrame(frame);
  targetX = 0;
  targetY = 0;
  currentX = 0;
  currentY = 0;
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(intensity: number): {
  ref: RefObject<T | null>;
  style: CSSProperties;
} {
  const ref = useRef<T>(null);
  const [style] = useState<CSSProperties>({ willChange: "transform" });

  useEffect(() => {
    const pointer = window.matchMedia("(hover: none), (pointer: coarse)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const amount = Math.max(-CAP, Math.min(CAP, intensity));

    const apply = (x: number, y: number) => {
      const el = ref.current;
      if (!el) return;
      if (pointer.matches || motion.matches) {
        el.style.transform = "";
        return;
      }
      const tx = (x * amount * 100).toFixed(3);
      const ty = (y * amount * 100).toFixed(3);
      el.style.transform = `translate3d(${tx}%, ${ty}%, 0)`;
    };

    const sync = () => {
      if (pointer.matches || motion.matches) {
        apply(0, 0);
        if (listeners.size === 0) stop();
        return;
      }
      start();
    };

    listeners.add(apply);
    sync();
    pointer.addEventListener("change", sync);
    motion.addEventListener("change", sync);

    return () => {
      listeners.delete(apply);
      pointer.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
      if (ref.current) ref.current.style.transform = "";
      if (listeners.size === 0) stop();
    };
  }, [intensity]);

  return { ref, style };
}
