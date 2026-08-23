import initConstellation from "./heroScenes/constellation.js";

export default function initHeroVariant() {
  const container = document.getElementById("hero-scene");
  if (!container) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  initConstellation(container);
}
