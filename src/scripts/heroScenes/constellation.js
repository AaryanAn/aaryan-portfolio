// Drifting particle network with pointer gravity, rendered on Canvas 2D (no WebGL needed).
// Adapted from ThreeUI's Constellation Field component (github.com/MengTo/threeui).
export default function initConstellation(container) {
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let width;
  let height;
  let nodes = [];
  const LINK = 150;
  const COLOR = "#64ffda";
  const pointer = { x: -1000, y: -1000 };

  const maxNodes = () => (container.clientWidth < 600 ? 32 : 70);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initNodes() {
    nodes = [];
    const count = maxNodes();
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2.2 + 1.6,
      });
    }
  }

  const onResize = () => {
    resize();
    initNodes();
  };
  const onPointerMove = (e) => {
    const rect = container.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  };
  const onPointerLeave = () => {
    pointer.x = -1000;
    pointer.y = -1000;
  };

  resize();
  initNodes();
  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerleave", onPointerLeave);

  function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  let frameId;
  function animate() {
    frameId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.strokeStyle = COLOR;
    ctx.lineWidth = 1;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const d = dist(nodes[i], nodes[j]);
        if (d < LINK) {
          ctx.globalAlpha = 0.12 + (1 - d / LINK) * 0.35;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      const pd = dist(node, pointer);
      if (pd < 200) {
        node.x -= (node.x - pointer.x) * 0.005;
        node.y -= (node.y - pointer.y) * 0.005;
      }

      const pulse = 0.7 + Math.sin(Date.now() * 0.001 + node.x) * 0.2;
      ctx.fillStyle = COLOR;
      ctx.globalAlpha = pulse * 0.18;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = pulse * 0.8;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
  }
  animate();

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerleave", onPointerLeave);
    container.removeChild(canvas);
  };
}
