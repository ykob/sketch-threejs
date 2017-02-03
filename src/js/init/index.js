import normalizeVector2 from '../modules/common/normalizeVector2';
import IndexScroller from '../modules/common/IndexScroller';
import TitleObject from '../modules/index/TitleObject';
import FrameObject from '../modules/index/FrameObject';
import SkyOctahedron from '../modules/index/SkyOctahedron';
import SkyOctahedronShell from '../modules/index/SkyOctahedronShell';
import Ground from '../modules/index/Ground';

const debounce = require('js-util/debounce');

export default function() {
  const indexScroller = new IndexScroller();

  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, document.body.clientWidth / window.innerHeight, 1, 10000);
  const clock = new THREE.Clock();

  const titleObject = new TitleObject();
  const frameObject = new FrameObject();
  const skyOctahedron = new SkyOctahedron();
  const skyOctahedronShell = new SkyOctahedronShell();
  const ground = new Ground();

  const resizeWindow = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    camera.aspect = document.body.clientWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.body.clientWidth, window.innerHeight);
  }
  const render = () => {
    const time = clock.getDelta();
    titleObject.render(time);
    skyOctahedron.render(time);
    skyOctahedronShell.render(time);
    ground.render(time);
    renderer.render(scene, camera);
  }
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  }
  const on = () => {
    window.addEventListener('resize', debounce(() => {
      resizeWindow();
    }), 1000);
  }

  const init = () => {
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1.0);
    camera.position.set(0, 0, 800);
    camera.lookAt(new THREE.Vector3());

    // scene.add(frameObject.obj);

    titleObject.loadTexture(() => {
      scene.add(titleObject.obj);
      scene.add(skyOctahedron.obj);
      scene.add(skyOctahedronShell.obj);
      scene.add(ground.obj);
    });
    on();
    resizeWindow();
    renderLoop();
  }
  init();
}
