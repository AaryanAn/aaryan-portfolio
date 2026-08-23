const VARIANTS = ["logic-core", "data-field", "nebula", "constellation"];
const STORAGE_KEY = "heroVariant";

const loaders = {
  "logic-core": () => import("./heroScenes/logicCore.js"),
  "data-field": () => import("./heroScenes/dataField.js"),
  nebula: () => import("./heroScenes/nebula.js"),
  constellation: () => import("./heroScenes/constellation.js"),
};

function pickVariant() {
  const params = new URLSearchParams(window.location.search);
  const override = params.get("variant");
  if (override && VARIANTS.includes(override)) return override;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && VARIANTS.includes(stored)) return stored;

  const chosen = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
  try {
    window.localStorage.setItem(STORAGE_KEY, chosen);
  } catch (e) {
    // localStorage unavailable (private browsing etc.) — fine, just won't persist
  }
  return chosen;
}

export default function initHeroVariant() {
  const container = document.getElementById("hero-scene");
  if (!container) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  const variant = pickVariant();
  container.dataset.variant = variant;

  loaders[variant]()
    .then((mod) => mod.default(container))
    .catch((err) => console.error("Hero scene failed to load:", err));
}
