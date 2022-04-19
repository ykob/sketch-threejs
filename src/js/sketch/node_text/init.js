const THREE = require('three');
const { debounce } = require('@ykob/js-util');
const NodeText = require('./NodeText').default;
const BackgroundSphere = require('./BackgroundSphere').default;

export default function() {
  // ==========
  // Define common variables
  //
  const resolution = new THREE.Vector2();
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGL1Renderer({
    alpha: true,
    antialias: true,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  const clock = new THREE.Clock();
  const loader = new THREE.FontLoader();

  camera.far = 50000;
  camera.setFocalLength(24);

  // ==========
  // Define unique variables
  //
  const nodeText = new NodeText();
  const bg = new BackgroundSphere();

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    nodeText.render(time);
    renderer.render(scene, camera);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const resizeCamera = () => {
    camera.aspect = resolution.x / resolution.y;
    camera.updateProjectionMatrix();
  };
  const resizeWindow = () => {
    resolution.set(document.body.clientWidth, window.innerHeight);
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera();
    renderer.setSize(resolution.x, resolution.y);
  };
  const on = () => {
    window.addEventListener('resize', debounce(resizeWindow, 1000));
    window.addEventListener('click', () => {
      nodeText.transform();
    });
  };

  // ==========
  // Initialize
  //
  const init = () => {
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      nodeText.createObj(font);
      bg.createObj();

      //scene.add(nodeText.obj);
      scene.add(nodeText.objWire);
      scene.add(nodeText.objPoints);
      scene.add(bg.obj);

      renderer.setClearColor(0x111111, 1.0);
      camera.position.set(0, 0, 1000);
      camera.lookAt(new THREE.Vector3());
      clock.start();

      on();
      resizeWindow();
      renderLoop();
    });
  }
  init();
}
