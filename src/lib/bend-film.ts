const vertex = `attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision mediump float;varying vec2 uv;uniform sampler2D film;uniform vec2 screen;uniform vec2 source;uniform vec2 pointer;uniform float power;uniform float time;vec2 cover(vec2 p){float a=screen.x/screen.y;float b=source.x/source.y;if(a>b)p.y=(p.y-.5)*b/a+.5;else p.x=(p.x-.5)*a/b+.5;return p;}void main(){vec2 p=uv;vec2 d=p-pointer;d.x*=screen.x/screen.y;float r=length(d);float wave=sin(r*26.-time*6.)*exp(-r*1.6)*power*.16;p+=normalize(d+vec2(.0001))*wave;p.x+=sin(p.y*14.+time*2.2)*power*.055;vec2 c=cover(p);float shift=power*.045*exp(-r*0.6);float red=texture2D(film,c+vec2(shift,0.)).r;float green=texture2D(film,c).g;float blue=texture2D(film,c-vec2(shift,0.)).b;gl_FragColor=vec4(red,green,blue,1.);}`;

type BendOptions = {
  video: HTMLVideoElement;
  parent: HTMLElement;
  track: HTMLElement;
  hold: HTMLButtonElement;
};

export function attachBend({ video, parent, track, hold }: BendOptions) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const point = { x: 0.5, y: 0.5 };
  let active = false;
  let started = false;
  let dead = false;
  let frame = 0;
  let canvas: HTMLCanvasElement | null = null;

  const label = () => {
    const node = hold.lastElementChild;
    if (node) node.textContent = reduced.matches ? "Reduced motion" : active ? "Reality, reworked." : "Hold to bend reality";
  };
  const end = () => {
    active = false;
    track.classList.remove("is-pressed");
    label();
  };
  const start = () => {
    if (reduced.matches) return;
    active = true;
    track.classList.add("is-pressed");
    label();
    if (!started) {
      started = true;
      initLens();
    }
  };
  const onDown = (event: PointerEvent) => {
    start();
    void event;
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      start();
    }
  };
  const onMove = (event: PointerEvent) => {
    const rect = track.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    point.x = (event.clientX - rect.left) / rect.width;
    point.y = (event.clientY - rect.top) / rect.height;
  };
  const motion = () => {
    hold.disabled = reduced.matches;
    if (reduced.matches) end();
  };

  hold.addEventListener("pointerdown", onDown);
  hold.addEventListener("pointerup", end);
  hold.addEventListener("pointercancel", end);
  hold.addEventListener("blur", end);
  hold.addEventListener("keydown", onKeyDown);
  hold.addEventListener("keyup", end);
  window.addEventListener("pointerup", end);
  track.addEventListener("pointermove", onMove);
  reduced.addEventListener("change", motion);
  motion();
  label();

  function initLens() {
    canvas = document.createElement("canvas");
    canvas.className = "x-lens";
    canvas.setAttribute("aria-hidden", "true");
    parent.appendChild(canvas);
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
        if (!canvas) return;
        canvas.width = Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 1.5));
        canvas.height = Math.round(canvas.clientHeight * Math.min(devicePixelRatio, 1.5));
        gl.viewport(0, 0, canvas.width, canvas.height);
      });
      resize.observe(canvas);
      let strength = 0;
      let lost = false;
      canvas.addEventListener("webglcontextlost", () => {
        lost = true;
        if (canvas) canvas.style.opacity = "0";
      });
      const draw = (t: number) => {
        if (dead || lost || !canvas) return;
        frame = requestAnimationFrame(draw);
        if (document.hidden) return;
        strength += (Number(active) - strength) * 0.22;
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
    canvas?.remove();
    end();
    hold.removeEventListener("pointerdown", onDown);
    hold.removeEventListener("pointerup", end);
    hold.removeEventListener("pointercancel", end);
    hold.removeEventListener("blur", end);
    hold.removeEventListener("keydown", onKeyDown);
    hold.removeEventListener("keyup", end);
    window.removeEventListener("pointerup", end);
    track.removeEventListener("pointermove", onMove);
    reduced.removeEventListener("change", motion);
  };
}
