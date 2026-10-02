import * as THREE from 'https://esm.sh/three@0.160.0';

const hero = document.querySelector('.hero');
const canvasHost = document.getElementById('hero-webgl');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

async function loadShaders() {
  const [vertex, fragment] = await Promise.all([
    fetch('lib/webgl/shaders/hero.vert.glsl').then((response) => {
      if (!response.ok) throw new Error('Hero vertex shader unavailable');
      return response.text();
    }),
    fetch('lib/webgl/shaders/hero.frag.glsl').then((response) => {
      if (!response.ok) throw new Error('Hero fragment shader unavailable');
      return response.text();
    }),
  ]);
  return { vertex, fragment };
}

async function initHeroBackground() {
  if (!hero || !canvasHost || !supportsWebGL()) return;

  try {
    const { vertex, fragment } = await loadShaders();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    canvasHost.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMotion: { value: reduceMotion.matches ? 0 : 1 },
      uIntensity: { value: 0.96 },
      uDitherScale: { value: 0.7 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      depthWrite: false,
      depthTest: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    let width = 0;
    let height = 0;
    const targetMouse = new THREE.Vector2(0.5, 0.5);
    const smoothMouse = new THREE.Vector2(0.5, 0.5);

    function resize() {
      const rect = hero.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const mobile = window.matchMedia('(max-width: 860px)').matches;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(width * renderer.getPixelRatio(), height * renderer.getPixelRatio());
      uniforms.uDitherScale.value = mobile ? 0.92 : 0.7;
    }

    function onPointerMove(event) {
      const rect = hero.getBoundingClientRect();
      targetMouse.set(
        THREE.MathUtils.clamp((event.clientX - rect.left) / rect.width, 0, 1),
        THREE.MathUtils.clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1),
      );
    }

    let animationFrame = 0;
    function render(now) {
      animationFrame = 0;
      uniforms.uTime.value = now * 0.001;
      if (!reduceMotion.matches) {
        smoothMouse.lerp(targetMouse, 0.035);
        uniforms.uMouse.value.copy(smoothMouse);
      }
      renderer.render(scene, camera);
      if (!reduceMotion.matches) startRendering();
    }

    function startRendering() {
      if (!animationFrame && !reduceMotion.matches) animationFrame = requestAnimationFrame(render);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(hero);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    reduceMotion.addEventListener('change', (event) => {
      uniforms.uMotion.value = event.matches ? 0 : 1;
      if (event.matches) renderer.render(scene, camera);
      else startRendering();
    });

    resize();
    hero.classList.add('webgl-ready');
    if (reduceMotion.matches) renderer.render(scene, camera);
    else startRendering();
  } catch (error) {
    canvasHost.replaceChildren();
    console.warn('Hero WebGL background unavailable; using the CSS fallback.', error);
  }
}

initHeroBackground();
