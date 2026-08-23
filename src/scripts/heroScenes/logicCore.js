import * as THREE from "three";

// Isometric platform with a pulsing "logic core" and orbiting data nodes.
// Adapted from ThreeUI's Logic Core component (github.com/MengTo/threeui).
export default function initLogicCore(container) {
  const scene = new THREE.Scene();

  const aspect = container.clientWidth / container.clientHeight;
  const d = 12;
  const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
  camera.position.set(20, 20, 20);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const basePlatformMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9, metalness: 0.1 });
  const coreEmissiveMat = new THREE.MeshStandardMaterial({ color: 0x64ffda, emissive: 0x64ffda, emissiveIntensity: 0.5, roughness: 0.2 });
  const wireframeMat = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.4 });

  const platformGeo = new THREE.BoxGeometry(16, 0.5, 16);
  const platform = new THREE.Mesh(platformGeo, basePlatformMat);
  platform.position.y = -2;
  group.add(platform);
  platform.add(new THREE.LineSegments(new THREE.EdgesGeometry(platformGeo), wireframeMat));

  const coreGeo = new THREE.BoxGeometry(2, 4, 2);
  const core = new THREE.Mesh(coreGeo, coreEmissiveMat);
  core.position.y = 0.25;
  group.add(core);

  const nodes = [];
  const nodeCount = 12;
  for (let i = 0; i < nodeCount; i++) {
    const isAccent = Math.random() > 0.7;
    const nodeMat = isAccent ? coreEmissiveMat : new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const size = 0.4 + Math.random() * 0.4;
    const nodeGeo = new THREE.BoxGeometry(size, size, size);
    const node = new THREE.Mesh(nodeGeo, nodeMat);

    const angle = (i / nodeCount) * Math.PI * 2;
    const radius = 4 + Math.random() * 4;
    node.position.set(Math.cos(angle) * radius, -1 + Math.random() * 4, Math.sin(angle) * radius);
    node.add(new THREE.LineSegments(new THREE.EdgesGeometry(nodeGeo), new THREE.LineBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.3 })));
    node.userData = { angle, radius, speed: 0.005 + Math.random() * 0.015, yBase: node.position.y, yOffset: Math.random() * Math.PI * 2 };
    group.add(node);
    nodes.push(node);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(10, 20, 5);
  scene.add(dirLight);
  const pointLight = new THREE.PointLight(0x64ffda, 1.5, 25);
  pointLight.position.set(0, 1, 0);
  scene.add(pointLight);

  let time = 0;
  let frameId;
  const animate = () => {
    frameId = requestAnimationFrame(animate);
    time += 0.016;

    group.rotation.y = Math.sin(time * 0.1) * 0.15;
    group.position.y = Math.sin(time * 0.5) * 0.2;

    const pulse = (Math.sin(time * 2.5) + 1) * 0.5;
    coreEmissiveMat.emissiveIntensity = 0.4 + pulse * 0.6;
    pointLight.intensity = 1.0 + pulse * 1.5;

    nodes.forEach((node) => {
      const { angle, radius, speed, yBase, yOffset } = node.userData;
      node.userData.angle += speed;
      node.position.x = Math.cos(node.userData.angle) * radius;
      node.position.z = Math.sin(node.userData.angle) * radius;
      node.position.y = yBase + Math.sin(time + yOffset) * 0.4;
      node.rotation.x += 0.01;
      node.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
  };
  animate();

  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    const a = w / h;
    camera.left = -d * a;
    camera.right = d * a;
    camera.top = d;
    camera.bottom = -d;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}
