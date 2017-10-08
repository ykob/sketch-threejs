import ForcePerspectiveCamera from '../modules/common/ForcePerspectiveCamera';
import SmoothScrollManager from '../modules/smooth_scroll_manager/SmoothScrollManager';
import TitleObject from '../modules/index/TitleObject';
import FrameObject from '../modules/index/FrameObject';
import SkyOctahedron from '../modules/index/SkyOctahedron';
import SkyOctahedronShell from '../modules/index/SkyOctahedronShell';
import Ground from '../modules/index/Ground';
import Debris from '../modules/index/Debris';
import PostEffect from '../modules/index/PostEffect';

const debounce = require('js-util/debounce');

export default function() {
  const scrollManager = new SmoothScrollManager();

  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas: canvas,
  });
  const renderBack = new THREE.WebGLRenderTarget(document.body.clientWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const sceneBack = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const cameraBack = new ForcePerspectiveCamera(45, document.body.clientWidth / window.innerHeight, 1, 10000);
  const clock = new THREE.Clock();

  const titleObject = new TitleObject();
  const frameObject = new FrameObject();
  const skyOctahedron = new SkyOctahedron();
  const skyOctahedronShell = new SkyOctahedronShell();
  const ground = new Ground();
  const debris = [
     new Debris(400, -500, 200),
     new Debris(-350, -600, -50),
     new Debris(-150, -700, -150),
     new Debris(-500, -900, 0),
     new Debris(100, -1100, 250),
     new Debris(-100, -1200, -300),
     new Debris(150, -1500, -100),
  ];
  const postEffect = new PostEffect(renderBack.texture);

  const elemIntro = document.getElementsByClassName('js-transition-intro');

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
    cameraBack.render();
    titleObject.render(time);
    skyOctahedron.render(time);
    skyOctahedronShell.render(time);
    ground.render(time);
    for (var i = 0; i < debris.length; i++) {
      debris[i].render(time);
    }
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

    scrollManager.renderNext = () => {
      cameraBack.anchor[1] = cameraBack.lookAnchor[1] = scrollManager.scrollTop * -0.6;
    }
  }
  const transitionOnload = () => {
    for (var i = 0; i < elemIntro.length; i++) {
      const elm = elemIntro[i];
      elm.classList.add('is-shown');
    }
  }

  const init = () => {
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1.0);
    cameraBack.velocity[2] = cameraBack.anchor[2] = 800;
    cameraBack.k = cameraBack.lookK = 0.3;
    cameraBack.d = cameraBack.lookD = 0.8;

    scene.add(postEffect.obj);
    titleObject.loadTexture(() => {
      sceneBack.add(titleObject.obj);
      sceneBack.add(skyOctahedron.obj);
      sceneBack.add(skyOctahedronShell.obj);
      sceneBack.add(ground.obj);
      for (var i = 0; i < debris.length; i++) {
        sceneBack.add(debris[i].obj);
      }
      transitionOnload();
    });

    on();
    resizeWindow();
    renderLoop();
    scrollManager.start();
  }
  init();
}
