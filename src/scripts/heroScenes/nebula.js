import * as THREE from "three";

// Soft indigo/teal cloud that drifts with the pointer, rendered as a fullscreen shader.
// Adapted from ThreeUI's Nebula component (github.com/MengTo/threeui).
export default function initNebula(container) {
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  container.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
  };

  const fragmentShader = `
    precision highp float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
    vec2 mod289(vec2 x){return x - floor(x*(1.0/289.0))*289.0;}
    vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    float fbm(vec2 p){
      float v = 0.0; float a = 0.55;
      for(int i=0;i<4;i++){ v += a*snoise(p); p *= 2.05; a *= 0.5; }
      return v;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / u_resolution.xy;
      vec2 p = uv;
      p.x *= u_resolution.x / u_resolution.y;

      float t = u_time * 0.05;
      vec2 drift = (u_mouse - 0.5) * 0.12;

      vec2 st = p * 0.85 + drift;
      st += vec2(fbm(st + t), fbm(st - t)) * 0.35;

      vec3 col = vec3(0.004, 0.008, 0.008);

      vec2 c1 = vec2(u_resolution.x / u_resolution.y * 0.62, 0.85) + drift;
      float d1 = length(p - c1);
      float n1 = fbm(st * 1.4 + t * 2.0);
      float mass = smoothstep(1.15, 0.05, d1 + n1 * 0.32);

      float tongue = smoothstep(0.55, 0.02, abs(p.x - (u_resolution.x/u_resolution.y*0.58) - n1*0.22)) * smoothstep(1.2, 0.1, abs(uv.y - 0.55));

      vec2 c2 = vec2(u_resolution.x / u_resolution.y * 1.05, 0.5);
      float d2 = length(p - c2);
      float mass2 = smoothstep(0.9, 0.0, d2 + fbm(st*1.1 - t)*0.25);

      vec3 deepTeal = vec3(0.02, 0.12, 0.11);
      vec3 teal = vec3(0.1, 0.45, 0.4);
      vec3 hotViolet = vec3(0.45, 0.3, 0.9);

      col = mix(col, deepTeal, clamp(mass*0.6 + mass2*0.45, 0.0, 1.0));
      col = mix(col, teal, clamp(mass*mass*0.7 + mass2*0.35, 0.0, 1.0));
      col += hotViolet * tongue * mass * 0.5;

      float pulse = 0.92 + 0.08 * sin(u_time * 0.4);
      col *= pulse;

      float vig = smoothstep(1.6, 0.35, length(uv - vec2(0.45, 0.5)));
      col *= mix(0.55, 1.0, vig);
      col *= mix(0.35, 1.0, smoothstep(0.0, 0.55, uv.x));

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: "void main(){ gl_Position = vec4(position, 1.0); }",
    fragmentShader,
    transparent: true,
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  const mouseTarget = { x: 0.5, y: 0.5 };
  const onPointerMove = (e) => {
    const rect = container.getBoundingClientRect();
    mouseTarget.x = (e.clientX - rect.left) / rect.width;
    mouseTarget.y = 1.0 - (e.clientY - rect.top) / rect.height;
  };
  window.addEventListener("pointermove", onPointerMove);

  const onResize = () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    uniforms.u_resolution.value.set(container.clientWidth, container.clientHeight);
  };
  window.addEventListener("resize", onResize);

  let frameId;
  const animate = () => {
    frameId = requestAnimationFrame(animate);
    uniforms.u_time.value += 0.016;
    uniforms.u_mouse.value.x += (mouseTarget.x - uniforms.u_mouse.value.x) * 0.05;
    uniforms.u_mouse.value.y += (mouseTarget.y - uniforms.u_mouse.value.y) * 0.05;
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    container.removeChild(canvas);
  };
}
