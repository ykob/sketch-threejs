const THREE = require('three');
const debounce = require('js-util/debounce');
const MathEx = require('js-util/MathEx');

const BuddhaHead = require('./BuddhaHead').default;
const Typo = require('./Typo').default;
const Wave = require('./Wave').default;
const Points = require('./Points').default;
const BackgroundSphere = require('./BackgroundSphere').default;
const PostEffect = require('./PostEffect').default;
const Drag = require('./Drag').default;

export default async function() {
  // ==========
  // Define common variables
  //
  const resolution = new THREE.Vector2();
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  const clock = new THREE.Clock({
    autoStart: false
  });

  // For the post effect.
  const renderTarget = new THREE.WebGLRenderTarget();
  const scenePE = new THREE.Scene();
  const cameraPE = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2);

  // ==========
  // Define unique variables
  //
  const buddhaHead = new BuddhaHead();
  const typo = new Typo();
  const wave = new Wave();
  const points = new Points();
  const bg = new BackgroundSphere();
  const dd = new Drag(resolution);

  // For the post effect.
  const postEffect = new PostEffect(renderTarget.texture);
  postEffect.createObj();
  scenePE.add(postEffect.obj);

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    dd.render(resolution);
    buddhaHead.render(time, dd.v.y, dd.v.x);
    typo.render(time);
    wave.render(time);
    points.render(time);

    // Render the main scene to frame buffer.
    renderer.render(scene, camera, renderTarget);

    // Render the post effect.
    postEffect.render(time);
    renderer.render(scenePE, cameraPE);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const resizeCamera = () => {
    camera.setFocalLength(Math.min(resolution.x / 1200, 1) * 35 + 15);
    camera.setViewOffset(
      1200,
      800,
      (resolution.x - 1200) / -2,
      (resolution.y - 800) / -2,
      resolution.x,
      resolution.y
    );
    camera.updateProjectionMatrix();
  };
  const resizeWindow = () => {
    resolution.set(document.body.clientWidth, window.innerHeight);
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera();
    renderer.setSize(resolution.x, resolution.y);
    renderTarget.setSize(resolution.x, resolution.y);
    postEffect.resize(resolution.x, resolution.y);
  };
  const on = () => {
    const touchstart = (e) => {
      dd.touchStart(e);
    }
    const touchmove = (e) => {
      dd.touchMove(e);
    }
    const touchend = (e) => {
      dd.touchEnd(e);
    }
    canvas.addEventListener('mousedown', touchstart, { passive: false });
    window.addEventListener('mousemove', touchmove, { passive: false });
    window.addEventListener('mouseup', touchend);
    canvas.addEventListener('touchstart', touchstart, { passive: false });
    window.addEventListener('touchmove', touchmove, { passive: false });
    window.addEventListener('touchend', touchend);

    window.addEventListener('resize', debounce(resizeWindow, 100));
  };

  // ==========
  // Initialize
  //
  renderer.setClearColor(0x090909, 1.0);

  camera.aspect = 3 / 2;
  camera.far = 1000;
  camera.position.set(0, 12, 85);
  camera.lookAt(new THREE.Vector3(0, 14, 0));

  await buddhaHead.createObj();
  await typo.createObj();
  wave.createObj();
  points.createObj();
  bg.createObj();

  typo.obj.renderOrder = 10;

  scene.add(buddhaHead.obj);
  scene.add(typo.obj);
  scene.add(wave.obj);
  scene.add(points.obj);
  scene.add(bg.obj);

  on();
  resizeWindow();

  clock.start();
  renderLoop();
}
