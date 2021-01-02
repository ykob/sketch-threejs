import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import Camera from './Camera';
import Core from './Core';
import CoreLight from './CoreLight';
import Aura from './Aura';
import Sparks from './Sparks';
import Trail from './Trail';
import Background from './Background';
import PostEffectBright from './PostEffectBright';
import PostEffectBlur from './PostEffectBlur';
import PostEffectBloom from './PostEffectBloom';

// ==========
// Define common variables
//
let renderer;
const scene = new THREE.Scene();
const camera = new Camera();
const clock = new THREE.Clock({
  autoStart: false
});


// For the post effect.
const renderTarget1 = new THREE.WebGLRenderTarget();
const renderTarget2 = new THREE.WebGLRenderTarget();
const renderTarget3 = new THREE.WebGLRenderTarget();
const scenePE = new THREE.Scene();
const cameraPE = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2);

// ==========
// Define unique variables
//
const core = new Core();
const coreLight = new CoreLight();
const aura = new Aura();
const sparks = new Sparks();
const trail = new Trail();
const background = new Background();
const texLoader = new THREE.TextureLoader();
const vTouch = new THREE.Vector2();
let isTouched = false;

// For the post effect.
const postEffectBright = new PostEffectBright();
const postEffectBlurX = new PostEffectBlur();
const postEffectBlurY = new PostEffectBlur();
const postEffectBloom = new PostEffectBloom();

// ==========
// Define WebGLContent Class.
//
export default class WebGLContent {
  constructor() {
  }
  async start(canvas) {
    renderer = new THREE.WebGL1Renderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0e0e0e, 1.0);

    await Promise.all([
      texLoader.loadAsync('/sketch-threejs/img/sketch/flow_field/noise.jpg'),
    ])
    .then(response => {
      const noiseTex = response[0];

      noiseTex.wrapS = THREE.RepeatWrapping;
      noiseTex.wrapT = THREE.RepeatWrapping;
      noiseTex.format = THREE.RGBFormat;
      noiseTex.type = THREE.FloatType;
      noiseTex.minFilter = THREE.NearestFilter;
      noiseTex.magFilter = THREE.NearestFilter;
      core.start(noiseTex);
      coreLight.start(noiseTex);
      aura.start(noiseTex);
      sparks.start(noiseTex);
      trail.start(noiseTex);
      background.start(noiseTex);
    })

    scene.add(core);
    scene.add(coreLight);
    scene.add(aura);
    scene.add(sparks);
    scene.add(trail);
    scene.add(background);

    camera.start();

    postEffectBright.start(renderTarget1.texture);
    postEffectBlurX.start(renderTarget2.texture, 1, 0);
    postEffectBlurY.start(renderTarget3.texture, 0, 1);
    postEffectBloom.start(renderTarget1.texture, renderTarget2.texture);
  }
  play() {
    clock.start();
    this.update();
  }
  pause() {
    clock.stop();
  }
  update() {
    // When the clock is stopped, it stops the all rendering too.
    if (clock.running === false) return;

    // Calculate msec for this frame.
    const time = clock.getDelta();

    // Update Camera.
    camera.update(time);

    // Update each objects.
    core.update(time, camera);
    coreLight.update(time, core);
    aura.update(time, core);
    sparks.update(time, core);
    trail.update(time, core);
    background.update(time);

    // Render the main scene to frame buffer.
    renderer.setRenderTarget(renderTarget1);
    renderer.render(scene, camera);

    // // Render the post effect.
    scenePE.add(postEffectBright);
    renderer.setRenderTarget(renderTarget2);
    renderer.render(scenePE, cameraPE);
    scenePE.remove(postEffectBright);
    scenePE.add(postEffectBlurX);
    renderer.setRenderTarget(renderTarget3);
    renderer.render(scenePE, cameraPE);
    scenePE.remove(postEffectBlurX);
    scenePE.add(postEffectBlurY);
    renderer.setRenderTarget(renderTarget2);
    renderer.render(scenePE, cameraPE);
    scenePE.remove(postEffectBlurY);
    scenePE.add(postEffectBloom);
    renderer.setRenderTarget(null);
    renderer.render(scenePE, cameraPE);
    scenePE.remove(postEffectBloom);
  }
  resize(resolution) {
    camera.resize(resolution);
    background.resize(camera, resolution);
    renderer.setSize(resolution.x, resolution.y);
    renderTarget1.setSize(resolution.x * renderer.getPixelRatio(), resolution.y * renderer.getPixelRatio());
    renderTarget2.setSize(resolution.x * renderer.getPixelRatio(), resolution.y * renderer.getPixelRatio());
    renderTarget3.setSize(resolution.x * renderer.getPixelRatio(), resolution.y * renderer.getPixelRatio());
    postEffectBlurY.resize(resolution.x / 4, resolution.y / 4);
    postEffectBlurX.resize(resolution.x / 4, resolution.y / 4);
  }
  setCoreAnchor(resolution) {
    const corePositionZ = (vTouch.y / resolution.y * 2.0 - 1.0) * 70;
    const height = Math.abs(
      (camera.position.z - corePositionZ) *
        Math.tan(MathEx.radians(camera.fov) / 2) *
        2
    );
    const width = height * camera.aspect;

    core.anchor.set(
      (vTouch.x / resolution.x - 0.5) * width,
      -(vTouch.y / resolution.y - 0.5) * height,
      corePositionZ
    );
  }
  touchStart(e, resolution) {
    if (!e.touches) e.preventDefault();

    vTouch.set(
      (e.touches) ? e.touches[0].clientX : e.clientX,
      (e.touches) ? e.touches[0].clientY : e.clientY
    );
    isTouched = true;
    this.setCoreAnchor(resolution);
  }
  touchMove(e, resolution) {
    if (!e.touches) e.preventDefault();

    if (isTouched === true) {
      vTouch.set(
        (e.touches) ? e.touches[0].clientX : e.clientX,
        (e.touches) ? e.touches[0].clientY : e.clientY
      );
      this.setCoreAnchor(resolution);
    }
  }
  touchEnd() {
    isTouched = false;
  }
}
