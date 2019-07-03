import * as THREE from 'three';
import MathEx from 'js-util/MathEx';
import sleep from 'js-util/sleep';

import PromiseTextureLoader from '../../common/PromiseTextureLoader';
import PromiseOBJLoader from '../../common/PromiseOBJLoader';

import ForcePerspectiveCamera from './ForcePerspectiveCamera';
import Crystal from './Crystal';
import CrystalSparkle from './CrystalSparkle';
import Fog from './Fog';
import Background from './Background';
import PostEffectBright from './PostEffectBright';
import PostEffectBlur from './PostEffectBlur';
import PostEffectBloom from './PostEffectBloom';

// ==========
// Define common variables
//
let renderer;
const scene = new THREE.Scene();
const camera = new ForcePerspectiveCamera();
const cameraResolution = new THREE.Vector2();
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
const CRYSTALS_COUNT = 20;
const FOGS_COUNT = 40;
const crystals = [];
const crystalSparkles = [];
const fogs = [];
const lookPosition = new THREE.Vector3();
const panPosition = new THREE.Vector3();
let lookIndex = 0;
let lookTimer = 0;

const bg = new Background();

// For the post effect.
const postEffectBright = new PostEffectBright();
const postEffectBlurX = new PostEffectBlur();
const postEffectBlurY = new PostEffectBlur();
const postEffectBloom = new PostEffectBloom();
postEffectBright.start(renderTarget1.texture);
postEffectBlurX.start(renderTarget2.texture, 1, 0);
postEffectBlurY.start(renderTarget3.texture, 0, 1);
postEffectBloom.start(renderTarget1.texture, renderTarget2.texture);

// ==========
// Define functions
//
const resizeCamera = (resolution) => {
  if (resolution.x > resolution.y) {
    cameraResolution.set(
      (resolution.x >= 1200) ? 1200 : resolution.x,
      (resolution.x >= 1200) ? 800 : resolution.x * 0.66,
    );
  } else {
    cameraResolution.set(
      ((resolution.y >= 1200) ? 800 : resolution.y * 0.66) * 0.8,
      ((resolution.y >= 1200) ? 1200 : resolution.y) * 0.8,
    );
  }
  camera.setViewOffset(
    cameraResolution.x,
    cameraResolution.y,
    (resolution.x - cameraResolution.x) / -2,
    (resolution.y - cameraResolution.y) / -2,
    resolution.x,
    resolution.y
  );
  camera.updateProjectionMatrix();
};

export default class WebGLContent {
  constructor() {
  }
  async start(canvas) {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0e0e0e, 1.0);

    camera.aspect = 3 / 2;
    camera.far = 1000;
    camera.setFocalLength(50);

    let crystalGeometries;
    let crystalNormalMap;
    let crystalSurfaceTex;
    let crystalFogTex;

    await Promise.all([
      PromiseOBJLoader('/sketch-threejs/model/crystal/crystal.obj'),
      PromiseTextureLoader('/sketch-threejs/img/sketch/crystal/normal.jpg'),
      PromiseTextureLoader('/sketch-threejs/img/sketch/crystal/surface.jpg'),
      PromiseTextureLoader('/sketch-threejs/img/sketch/crystal/fog.jpg'),
    ]).then((response) => {
      crystalGeometries = response[0].children.map((mesh) => {
        return mesh.geometry;
      });
      crystalNormalMap = response[1];
      crystalSurfaceTex = response[2];
      crystalFogTex = response[3];
      crystalFogTex.wrapS = THREE.RepeatWrapping;
      crystalFogTex.wrapT = THREE.RepeatWrapping;
    }).catch((error) => {
      console.log(error)
    });

    for (var i = 0; i < CRYSTALS_COUNT; i++) {
      const radian = MathEx.radians(i / CRYSTALS_COUNT * 360);
      crystals[i] = new Crystal(crystalGeometries[i % 3]);
      crystals[i].position.set(
        Math.cos(radian) * 35,
        0,
        Math.sin(radian) * 35
      );
      crystals[i].start(i / CRYSTALS_COUNT, crystalNormalMap, crystalSurfaceTex, crystalFogTex);
      scene.add(crystals[i]);

      crystalSparkles[i] = new CrystalSparkle();
      crystalSparkles[i].position.copy(crystals[i].position);
      crystalSparkles[i].start(i / CRYSTALS_COUNT);
      scene.add(crystalSparkles[i]);
    }
    for (var i = 0; i < FOGS_COUNT; i++) {
      const radian1 = MathEx.radians(i / FOGS_COUNT * 360);
      const radian2 = MathEx.radians(i / FOGS_COUNT * -360 - 90);
      const radius = 100;
      fogs[i] = new Fog();
      fogs[i].position.set(
        Math.cos(radian1) * radius,
        -18 - Math.sin(MathEx.radians(i / FOGS_COUNT * 360 * 8)) * 8,
        Math.sin(radian1) * radius
      );
      fogs[i].rotation.set(0, radian2, 0);
      fogs[i].start(i / FOGS_COUNT, crystalFogTex);
      scene.add(fogs[i]);
    }

    scene.add(bg);

    lookPosition.copy(crystals[lookIndex].position);
  }
  stop() {
    this.pause();
  }
  play(dd) {
    clock.start();
    this.update(dd);
  }
  pause() {
    clock.stop();
  }
  update(dd) {
    // When the clock is stopped, it stops the all rendering too.
    if (clock.running === false) return;

    // Calculate msec for this frame.
    const time = clock.getDelta();

    // Update each objects.
    for (var i = 0; i < crystals.length; i++) {
      crystals[i].update(time);
      crystalSparkles[i].update(time);
    }
    for (var i = 0; i < fogs.length; i++) {
      fogs[i].update(time);
    }
    bg.update(
      time,
      Math.atan2(
        camera.lookVelocity.z,
        camera.lookVelocity.x
      ) / MathEx.radians(360)
    );

    lookPosition.set(
      Math.cos(MathEx.radians(-dd.anchor.x * 0.6)),
      0,
      Math.sin(MathEx.radians(-dd.anchor.x * 0.6)),
    );
    camera.lookAnchor.copy(
      lookPosition.clone().add(
        panPosition.clone().applyQuaternion(camera.quaternion)
      )
    );
    camera.update();

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
    resizeCamera(resolution);
    renderer.setSize(resolution.x, resolution.y);
    renderTarget1.setSize(resolution.x * renderer.getPixelRatio(), resolution.y * renderer.getPixelRatio());
    renderTarget2.setSize(resolution.x * renderer.getPixelRatio(), resolution.y * renderer.getPixelRatio());
    renderTarget3.setSize(resolution.x * renderer.getPixelRatio(), resolution.y * renderer.getPixelRatio());
    postEffectBlurY.resize(resolution.x / 3, resolution.y / 3);
    postEffectBlurX.resize(resolution.x / 3, resolution.y / 3);
  }
  pan(v) {
    panPosition.copy(v);
  }
}
