const THREE = require('three');
const { debounce } = require('@ykob/js-util');

const SmoothScrollManager = require('../smooth_scroll_manager/SmoothScrollManager').default;
const TitleObject = require('./TitleObject').default;
const SkyOctahedron = require('./SkyOctahedron').default;
const SkyOctahedronShell = require('./SkyOctahedronShell').default;
const Ground = require('./Ground').default;
const Debris = require('./Debris').default;
const PostEffect = require('./PostEffect').default;

export default function() {
  const scrollManager = new SmoothScrollManager();

  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGL1Renderer({
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
    titleObject.render(time);
    skyOctahedron.render(time);
    skyOctahedronShell.render(time);
    ground.render(time);
    for (var i = 0; i < debris.length; i++) {
      debris[i].render(time);
    }
    renderer.setRenderTarget(renderBack);
    renderer.render(sceneBack, cameraBack);
    postEffect.render(time);
    renderer.setRenderTarget(null);
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
      if (scrollManager.isValidSmooth()) {
        cameraBack.position.y = scrollManager.hookes.contents.velocity[1] * 0.6;
      } else {
        cameraBack.position.y = scrollManager.scrollTop * -1;
      }
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
    cameraBack.position.z = 800;

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

    clock.start();

    on();
    resizeWindow();
    renderLoop();
    scrollManager.start();
  }
  init();
}
