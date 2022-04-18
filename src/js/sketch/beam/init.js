const THREE = require('three');
const { debounce } = require('@ykob/js-util');
const Beam = require('./Beam').default;

export default function() {
  const resolution = new THREE.Vector2();
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(120, 1, 1, 10000);
  const clock = new THREE.Clock();

  const vectorTouchStart = new THREE.Vector2();
  const vectorTouchMove = new THREE.Vector2();
  const vectorTouchEnd = new THREE.Vector2();

  let isDrag = false;

  //
  // process for this sketch.
  //

  const beam = new Beam();

  //
  // common process
  //
  const render = () => {
    const time = clock.getDelta();
    beam.render(time);
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
  const touchStart = (isTouched) => {
    isDrag = true;
  };
  const touchMove = (isTouched) => {
    if (isDrag) {}
  };
  const touchEnd = (isTouched) => {
    isDrag = false;
  };
  const on = () => {
    window.addEventListener('resize', debounce(resizeWindow, 1000));
    canvas.addEventListener('mousedown', (event) => {
      event.preventDefault();
      vectorTouchStart.set(event.clientX, event.clientY);
      touchStart(false);
    });
    document.addEventListener('mousemove', (event) => {
      event.preventDefault();
      vectorTouchMove.set(event.clientX, event.clientY);
      touchMove(false);
    });
    document.addEventListener('mouseup', (event) => {
      event.preventDefault();
      vectorTouchEnd.set(event.clientX, event.clientY);
      touchEnd(false);
    });
    canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();
      vectorTouchStart.set(event.touches[0].clientX, event.touches[0].clientY);
      touchStart(true);
    });
    canvas.addEventListener('touchmove', (event) => {
      event.preventDefault();
      vectorTouchMove.set(event.touches[0].clientX, event.touches[0].clientY);
      touchMove(true);
    });
    canvas.addEventListener('touchend', (event) => {
      event.preventDefault();
      vectorTouchEnd.set(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      touchEnd(true);
    });
  };

  const init = () => {
    on();
    resizeWindow();

    beam.createObj();
    scene.add(beam.obj);

    renderer.setClearColor(0x0e0e0e, 1.0);
    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    renderLoop();
  }
  init();
}
