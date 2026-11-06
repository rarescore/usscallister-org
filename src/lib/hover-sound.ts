let ctx: AudioContext | null = null;
let enabled = true;

function context(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const legacy = window as Window & { webkitAudioContext?: typeof AudioContext };
  const Ctx = window.AudioContext || legacy.webkitAudioContext;
  if (!Ctx) return null;
  if (!ctx) ctx = new Ctx();
  return ctx;
}

export function installAudio(): () => void {
  const arm = () => {
    const audio = context();
    if (audio && audio.state === "suspended") void audio.resume();
  };
  window.addEventListener("pointerdown", arm);
  return () => window.removeEventListener("pointerdown", arm);
}

export function setSoundEnabled(next: boolean) {
  enabled = next;
  if (next) {
    const audio = context();
    if (audio && audio.state === "suspended") void audio.resume();
  }
}

export function soundEnabled() {
  return enabled;
}

function tone(freq: number, duration: number, type: OscillatorType, gain: number) {
  if (!enabled) return;
  const audio = context();
  if (!audio) return;
  const start = () => {
    if (!enabled || audio.state !== "running") return;
    const t = audio.currentTime;
    const osc = audio.createOscillator();
    const amp = audio.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(amp);
    amp.connect(audio.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  };
  if (audio.state === "suspended") {
    void audio.resume().then(start).catch(() => {});
    return;
  }
  start();
}

export function playHover(index: number) {
  const scale = [494, 554, 622, 698, 784, 880];
  tone(scale[index % scale.length] ?? 620, 0.07, "triangle", 0.035);
}

export function playNav() {
  tone(740, 0.045, "triangle", 0.028);
}

export function playOpen() {
  tone(392, 0.09, "sine", 0.04);
}

export function playWhoosh() {
  tone(168, 0.16, "sine", 0.03);
}
