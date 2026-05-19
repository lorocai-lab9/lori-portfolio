// ===========================================================
// Robot arm hero widget
//   - 3D arm rendered in <canvas#arm-canvas>
//   - Whole arm rotates as a rigid body to face the cursor
//     (model isn't rigged, so no per-joint articulation)
//   - Cursor over the canvas region becomes a random fruit
//   - Cleanly skipped on touch devices
// ===========================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const canvas = document.getElementById('arm-canvas');
const stage  = canvas?.parentElement;

if (canvas && stage) {
  if (matchMedia('(pointer: coarse)').matches) {
    stage.style.display = 'none';
  } else {
    initArm();
    initFruitCursor();
  }
}

function initArm() {
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.4, 4.6);
  camera.lookAt(0, 1.0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // Lights — soft three-point + a mint accent rim
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 4);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xffffff, 0.45);
  fill.position.set(-3, 2, -2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0x68ff7e, 0.35);   // accent green
  rim.position.set(0, 1, -3);
  scene.add(rim);

  // Resize — keep canvas crisp without distortion
  function resize() {
    const r = stage.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  resize();
  new ResizeObserver(resize).observe(stage);

  // State — yaw only. The model is one rigid mesh, so pitch (rotation.x)
  // would tilt the base off the ground. Real "reach" needs bones.
  const state = {
    pivot: null,
    targetYaw: 0,
    yaw: 0,
  };

  // Path is relative so it resolves under both the local root and the
  // GitHub Pages project subpath (/lori-portfolio/).
  const draco = new DRACOLoader();
  draco.setDecoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/draco/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);
  loader.load(
    'assets/robot-arm.optimized.glb',
    (gltf) => {
      const arm = gltf.scene;

      // Compute bounds
      const box  = new THREE.Box3().setFromObject(arm);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());

      // Center horizontally; bottom of mesh sits at y=0
      arm.position.x -= center.x;
      arm.position.z -= center.z;
      arm.position.y -= box.min.y;

      // Scale so the arm is ~2.0 units tall
      const targetH = 2.0;
      arm.scale.setScalar(targetH / size.y);

      // The GLB's intrinsic pose has the gripper tilted to camera-right.
      // Pre-rotate the arm so yaw=0 means "facing camera" — this makes the
      // ±yaw range visually symmetric. Tune REST_OFFSET if left/right travel
      // still feels off (try -PI/6 ≈ -30° or -PI/3 ≈ -60°).
      const REST_OFFSET = -Math.PI / 4;  // -45°
      arm.rotation.y = REST_OFFSET;

      // Pivot wrapper so we can rotate around the base, not the centroid
      const pivot = new THREE.Group();
      pivot.add(arm);
      scene.add(pivot);

      state.pivot = pivot;
      stage.classList.add('is-loaded');
    },
    undefined,
    (err) => {
      console.error('robot-arm: GLB load failed', err);
      stage.style.display = 'none';
    }
  );

  // Mouse over the stage region drives target yaw (left/right only)
  stage.addEventListener('mousemove', (e) => {
    const r = stage.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;  // -1 .. +1
    state.targetYaw = nx * (Math.PI / 2.2);   // ±~80° — wider so left/right is unmistakable
  });
  stage.addEventListener('mouseleave', () => {
    state.targetYaw = 0;
  });

  // Render loop
  function tick() {
    if (state.pivot) {
      state.yaw += (state.targetYaw - state.yaw) * 0.14;  // snappier
      state.pivot.rotation.y = state.yaw;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

// ===========================================================
// Fruit cursor — random emoji while in the arm region
// ===========================================================

const FRUITS = ['🍎', '🍊', '🍌', '🍑', '🍓', '🍇', '🥑', '🍒', '🍐', '🍋'];

function initFruitCursor() {
  const stage = document.querySelector('.arm-stage');
  if (!stage) return;

  const fruit = document.createElement('div');
  fruit.className = 'fruit-cursor';
  document.body.appendChild(fruit);

  let inRegion = false;

  stage.addEventListener('mouseenter', () => {
    inRegion = true;
    fruit.textContent = FRUITS[Math.floor(Math.random() * FRUITS.length)];
    document.body.classList.add('in-arm-region');
  });
  stage.addEventListener('mouseleave', () => {
    inRegion = false;
    document.body.classList.remove('in-arm-region');
  });

  window.addEventListener('mousemove', (e) => {
    if (!inRegion) return;
    fruit.style.transform =
      `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });
}
