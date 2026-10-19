/** Animate the supplied raster artwork only. No libraries or network services. */
export function createLiquidAura(canvas, fallback, { disabled = false, pixelBudget = 3_000_000 } = {}) {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const section = canvas.parentElement;
  let gl;
  try { gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false }); } catch {}
  if (!gl) return { supported: false, setPlaying() {}, setScrollProgress() {}, destroy() {} };

  const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision > 0 ? 'highp' : 'mediump';
  const viewport = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
  const maxSize = Math.min(4096, gl.getParameter(gl.MAX_RENDERBUFFER_SIZE), viewport[0], viewport[1]);
  let assetAspect = 1490 / 1056;
  const vertex = `attribute vec2 position; varying ${precision} vec2 uv;
    void main() { uv = position * .5 + .5; gl_Position = vec4(position, 0., 1.); }`;
  const fragment = `precision ${precision} float;
    varying ${precision} vec2 uv; uniform sampler2D artwork; uniform float time;
    uniform vec2 pointer; uniform float strength; uniform vec2 cover; uniform float scroll;
    void main() {
      vec2 p = vec2(uv.x, 1. - uv.y);
      float t = time + scroll * 3.5;
      vec2 drift = vec2(
        sin(p.y * 8. + t * .31) + .45 * sin(p.x * 11. - t * .19),
        cos(p.x * 7. - t * .27) + .40 * sin(p.y * 13. + t * .16));
      float breath = sin(t * .714);
      vec2 q = (p - .5) / (1. + .011 * breath * strength) + .5;
      q += drift * vec2(.014, .018) * strength;
      q += pointer * .005 * strength;
      q = (q - .5) * cover + .5;
      vec4 color = texture2D(artwork, clamp(q, .001, .999));
      float edge = smoothstep(0., .035, p.x) * smoothstep(0., .035, 1. - p.x)
        * smoothstep(0., .035, p.y) * smoothstep(0., .035, 1. - p.y);
      float glow = .89 + .07 * breath + .04 * sin(t * .449 + p.x * 4.);
      // The uploaded texture is premultiplied: fade RGB and alpha together.
      float opacity = edge * .72;
      gl_FragColor = vec4(color.rgb * glow * opacity, color.a * opacity);
    }`;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader); throw new Error('Liquid shader unavailable');
    }
    return shader;
  }
  let program, vs, fs, buffer, texture;
  try {
    vs = compile(gl.VERTEX_SHADER, vertex); fs = compile(gl.FRAGMENT_SHADER, fragment);
    program = gl.createProgram(); gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Liquid shader unavailable');
    gl.useProgram(program);
    buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  } catch {
    if (texture) gl.deleteTexture(texture);
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    if (vs) gl.deleteShader(vs); if (fs) gl.deleteShader(fs);
    return { supported: false, setPlaying() {}, setScrollProgress() {}, destroy() {} };
  }
  const uniforms = Object.fromEntries(['time', 'pointer', 'strength', 'cover', 'scroll'].map(name => [name, gl.getUniformLocation(program, name)]));
  let ready = false, inView = false, raf = 0, last = 0, elapsed = 0, disposed = false;
  let userPaused = false;
  let scroll = 1;
  let playing = !media.matches && !disabled, targetX = 0, targetY = 0, x = 0, y = 0;
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  function size() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 2, 2048 / Math.max(rect.width, 1), maxSize / Math.max(rect.width, rect.height, 1), Math.sqrt(pixelBudget / Math.max(1, rect.width * rect.height)));
    canvas.width = Math.max(1, Math.round(rect.width * ratio));
    canvas.height = Math.max(1, Math.round(rect.height * ratio));
    gl.viewport(0, 0, canvas.width, canvas.height);
    const areaAspect = rect.width / Math.max(rect.height, 1);
    gl.uniform2f(uniforms.cover, Math.min(1, areaAspect / assetAspect), Math.min(1, assetAspect / areaAspect));
    if (ready) render();
  }
  function render() {
    if (!ready || disposed) return;
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform1f(uniforms.scroll, scroll);
    gl.uniform1f(uniforms.strength, 1);
    gl.uniform2f(uniforms.pointer, x, y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  function tick(now) {
    raf = 0;
    if (!ready || !playing || !inView || document.hidden || disposed) return;
    const delta = Math.min((now - last) / 1000, .1);
    if (delta >= 1 / 30) {
      elapsed += delta; last = now;
      const blend = 1 - Math.exp(-delta / .7);
      x += (targetX - x) * blend; y += (targetY - y) * blend;
      render();
    }
    raf = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(raf); raf = 0;
    canvas.dataset.motion = playing ? 'flowing' : 'still';
    section.dispatchEvent(new Event('liquidstatechange'));
    render();
    if (ready && playing && inView && !document.hidden && !disposed) {
      last = performance.now(); raf = requestAnimationFrame(tick);
    }
  }
  function pointer(event) {
    if (!fine.matches || !playing) return;
    const rect = section.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    targetY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
  }
  function resetPointer() { targetX = targetY = 0; }
  function preference() { playing = !media.matches && !disabled && !userPaused; sync(); }
  function lost(event) {
    event.preventDefault(); ready = false; cancelAnimationFrame(raf); canvas.hidden = true;
    fallback.hidden = false; canvas.dataset.renderer = 'static-fallback';
    section.dispatchEvent(new Event('liquidstatechange'));
  }
  const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
  const resize = new ResizeObserver(size);
  observer.observe(section); resize.observe(canvas);
  section.addEventListener('pointermove', pointer); section.addEventListener('pointerleave', resetPointer);
  document.addEventListener('visibilitychange', sync); media.addEventListener('change', preference);
  canvas.addEventListener('webglcontextlost', lost);
  const asset = new Image();
  asset.onload = () => {
    if (disposed) return;
    try {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // Remove hidden RGB before LINEAR filtering, preventing blue fringes on iOS.
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset);
      assetAspect = asset.naturalWidth / asset.naturalHeight;
      ready = true; canvas.hidden = false; fallback.hidden = true;
      canvas.dataset.renderer = 'webgl-texture'; size(); sync();
    } catch { canvas.dataset.renderer = 'static-fallback'; section.dispatchEvent(new Event('liquidstatechange')); }
  };
  asset.onerror = () => { canvas.dataset.renderer = 'static-fallback'; section.dispatchEvent(new Event('liquidstatechange')); };
  asset.src = fallback.currentSrc || fallback.src;
  return {
    supported: true,
    get playing() { return playing; },
    get ready() { return ready; },
    setScrollProgress(value) {
      if (!playing) return;
      const next = Math.max(0, Math.min(1, value));
      scroll = next;
    },
    setPlaying(value) { userPaused = !value; playing = Boolean(value) && !media.matches && !disabled; sync(); },
    destroy() {
      disposed = true; cancelAnimationFrame(raf); observer.disconnect(); resize.disconnect();
      section.removeEventListener('pointermove', pointer); section.removeEventListener('pointerleave', resetPointer);
      document.removeEventListener('visibilitychange', sync); media.removeEventListener('change', preference);
      canvas.removeEventListener('webglcontextlost', lost);
      gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program);
      gl.deleteShader(vs); gl.deleteShader(fs); canvas.hidden = true; fallback.hidden = false;
    }
  };
}
