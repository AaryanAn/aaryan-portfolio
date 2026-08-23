import * as THREE from "three";

// Flowing wireframe plane, like a folded data waveform drifting through space.
// Adapted from ThreeUI's Data Field component (github.com/MengTo/threeui).
export default function initDataField(container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, -2, 9);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const numLines = 60;
  const pointsPerLine = 100;
  const colorStart = new THREE.Color("#64ffda");
  const colorEnd = new THREE.Color("#bb86fc");

  const lines = [];
  for (let i = 0; i < numLines; i++) {
    const points = [];
    const xPos = (i - numLines / 2) * 0.22;
    for (let j = 0; j < pointsPerLine; j++) {
      const yPos = (j - pointsPerLine / 2) * 0.2;
      points.push(new THREE.Vector3(xPos, yPos, 0));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const color = new THREE.Color().lerpColors(colorStart, colorEnd, i / numLines);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.08 + Math.random() * 0.18,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.Line(geometry, material);
    group.add(line);
    lines.push({ line, xPos, phase: Math.random() * Math.PI * 2 });
  }

  group.rotation.x = Math.PI / 3;
  group.rotation.z = -Math.PI / 8;

  let time = 0;
  let frameId;
  const animate = () => {
    frameId = requestAnimationFrame(animate);
    time += 0.008;

    lines.forEach(({ line, xPos, phase }) => {
      const positions = line.geometry.attributes.position;
      for (let j = 0; j < pointsPerLine; j++) {
        const yPos = (j - pointsPerLine / 2) * 0.2;
        const z = Math.sin(yPos * 0.5 + time + xPos * 0.3 + phase) * 0.6;
        positions.setZ(j, z);
      }
      positions.needsUpdate = true;
    });

    group.rotation.y = Math.sin(time * 0.2) * 0.1;
    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}
