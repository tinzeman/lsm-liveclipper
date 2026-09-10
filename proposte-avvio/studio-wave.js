(() => {
  const canvas = document.querySelector('#studio-wave');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const target = { x: 0.5, y: 0.5, strength: 0 };
  const pointer = { ...target };
  let width = 0, height = 0, frame = 0, last = 0, phase = 0;

  function resize() {
    width = innerWidth;
    height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    // Slow continuous traces; the pointer bends the envelope, never the UI.
    const middle = height * 0.50;
    const amplitude = Math.min(height * 0.37, 320);
    const palette = ctx.createLinearGradient(0, 0, width, 0);
    palette.addColorStop(0, 'rgba(157,205,181,0)');
    palette.addColorStop(0.18, 'rgba(157,205,181,0.68)');
    palette.addColorStop(0.58, 'rgba(169,197,192,0.78)');
    palette.addColorStop(0.85, 'rgba(178,169,212,0.62)');
    palette.addColorStop(1, 'rgba(178,169,212,0)');
    ctx.strokeStyle = palette;
    for (let line = 0; line < 15; line++) {
      const spread = (line - 7) / 7;
      ctx.beginPath();
      for (let x = 0; x <= width + 6; x += 6) {
        const u = x / width;
        const envelope = Math.sin(Math.PI * Math.min(u, 1)) ** 1.4;
        const distance = (u - pointer.x) / 0.2;
        const influence = Math.exp(-distance * distance) * pointer.strength;
        const wave = Math.sin(u * Math.PI * 3.6 - phase + spread * 0.38);
        const fine = Math.sin(u * Math.PI * 6 + phase * 0.48 + spread * 0.6) * 0.22;
        const bend = (pointer.y - 0.5) * 135 * influence;
        const y = middle + envelope * amplitude * (wave + fine) * (0.68 + spread * 0.25)
          + spread * 13 + bend + influence * wave * 22;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.lineWidth = line === 7 ? 1.4 : 0.85;
      ctx.globalAlpha = line === 7 ? 1 : 0.64;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }
  function tick(now) {
    frame = 0;
    if (document.hidden || reduced.matches) return;
    if (now - last >= 32) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      phase += dt * 0.29;
      const smoothing = 1 - Math.exp(-dt * 3.2);
      for (const key of ['x', 'y', 'strength']) pointer[key] += (target[key] - pointer[key]) * smoothing;
      draw();
    }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    last = performance.now();
    if (reduced.matches) {
      pointer.x = pointer.y = 0.5;
      pointer.strength = 0;
      draw();
    } else if (!document.hidden) frame = requestAnimationFrame(tick);
  }
  addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reduced.matches) return;
    target.x = event.clientX / width;
    target.y = event.clientY / height;
    target.strength = 1;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { target.strength = 0; });
  addEventListener('blur', () => { target.strength = 0; });
  addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  resize();
  sync();
})();
