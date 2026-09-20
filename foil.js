(function () {
  const canvas = document.getElementById("foil");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, target = { x: 0, y: 0 };
    function measure() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const word = document.querySelector(".word");
      if (word) {
        const r = word.getBoundingClientRect();
        target.x = r.left + r.width * 0.5;
        target.y = r.top + r.height * 0.45;
      } else {
        target.x = W * 0.72;
        target.y = 28;
      }
    }
    measure();
    window.addEventListener("resize", measure);
    function flake() {
      return {
        x: Math.random() * W,
        y: -20 - Math.random() * H * 0.4,
        vx: (Math.random() - 0.5) * 18,
        vy: 8 + Math.random() * 14,
        a: Math.random() * Math.PI * 2,
        va: (Math.random() - 0.5) * 1.2,
        s: 0.55 + Math.random() * 0.7,
        stuck: false
      };
    }
    const leaves = Array.from({ length: 16 }, flake);
    const k = 1.8, g = 22;
    const wind = () => Math.sin(performance.now() / 2800) * 10;
    function leafPath(c, s) {
      c.beginPath();
      c.moveTo(0, -10 * s);
      c.bezierCurveTo(8 * s, -6 * s, 10 * s, 2 * s, 0, 12 * s);
      c.bezierCurveTo(-10 * s, 2 * s, -8 * s, -6 * s, 0, -10 * s);
      c.closePath();
    }
    function step(dt) {
      for (const L of leaves) {
        if (L.stuck) continue;
        L.vx += (-k * L.vx + wind() + (Math.random() - 0.5) * 8) * dt;
        L.vy += (g - k * L.vy) * dt;
        L.x += L.vx * dt;
        L.y += L.vy * dt;
        L.a += L.va * dt;
        const dx = target.x - L.x, dy = target.y - L.y, d2 = dx * dx + dy * dy;
        if (d2 < 220 * 220 && d2 > 16) {
          const d = Math.sqrt(d2), pull = 180 / d;
          L.vx += (dx / d) * pull * dt;
          L.vy += (dy / d) * pull * dt;
        }
        if (d2 < 26 * 26 && Math.random() < 0.28) {
          L.stuck = true;
          L.vx = L.vy = 0;
        }
        if (L.y > H + 30 || L.x < -40 || L.x > W + 40) Object.assign(L, flake(), { y: -16 });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const L of leaves) {
        ctx.save();
        ctx.translate(L.x, L.y);
        ctx.rotate(L.a);
        const gld = ctx.createLinearGradient(-8, -10, 8, 12);
        gld.addColorStop(0, "rgba(196,160,70,0.12)");
        gld.addColorStop(0.45, "rgba(234,220,160,0.88)");
        gld.addColorStop(1, "rgba(212,175,55,0.45)");
        ctx.fillStyle = gld;
        leafPath(ctx, L.s);
        ctx.fill();
        ctx.restore();
      }
    }
    let last = performance.now();
    function tick(now) {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const latch = document.getElementById("latch");
  const panel = document.getElementById("leaf-panel");
  if (!latch || !panel) return;
  function setOpen(open) {
    document.body.classList.toggle("menu-open", open);
    latch.setAttribute("aria-expanded", open ? "true" : "false");
    panel.setAttribute("aria-hidden", open ? "false" : "true");
  }
  latch.addEventListener("click", () => setOpen(!document.body.classList.contains("menu-open")));
  panel.addEventListener("click", (e) => {
    if (e.target === panel || e.target.closest("[data-close]")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
})();
