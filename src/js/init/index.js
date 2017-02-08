import normalizeVector2 from '../modules/common/normalizeVector2';
import IndexScroller from '../modules/common/IndexScroller';
import TitleObject from '../modules/index/TitleObject';
import FrameObject from '../modules/index/FrameObject';
import SkyOctahedron from '../modules/index/SkyOctahedron';
import SkyOctahedronShell from '../modules/index/SkyOctahedronShell';
import Ground from '../modules/index/Ground';
import PostEffect from '../modules/index/PostEffect';

const debounce = require('js-util/debounce');

export default function() {
  const indexScroller = new IndexScroller();

  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas: canvas,
  });
  const renderBack = new THREE.WebGLRenderTarget(document.body.clientWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const sceneBack = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const cameraBack = new THREE.PerspectiveCamera(45, document.body.clientWidth / window.innerHeight, 1, 10000);
  const clock = new THREE.Clock();

  const titleObject = new TitleObject();
  const frameObject = new FrameObject();
  const skyOctahedron = new SkyOctahedron();
  const skyOctahedronShell = new SkyOctahedronShell();
  const ground = new Ground();
  const postEffect = new PostEffect(renderBack.texture);

  const introRow = document.getElementsByClassName('p-introduction__row');

  const resizeWindow = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    cameraBack.aspect = document.body.clientWidth / window.innerHeight;
    cameraBack.updateProjectionMatrix();
    renderBack.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    postEffect.resize();
  }
  const render = () => {
    const time = clock.getDelta();
    titleObject.render(time);
    skyOctahedron.render(time);
    skyOctahedronShell.render(time);
    ground.render(time);
    renderer.render(sceneBack, cameraBack, renderBack);
    postEffect.render(time);
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
    cameraBack.position.set(0, 0, 800);
    cameraBack.lookAt(new THREE.Vector3());

    scene.add(postEffect.obj);
    titleObject.loadTexture(() => {
      sceneBack.add(titleObject.obj);
      sceneBack.add(skyOctahedron.obj);
      sceneBack.add(skyOctahedronShell.obj);
      sceneBack.add(ground.obj);
      for (var i = 0; i < introRow.length; i++) {
        introRow[i].classList.add('is-opened');
      }
    });

    on();
    resizeWindow();
    renderLoop();
  }
  init();
}
