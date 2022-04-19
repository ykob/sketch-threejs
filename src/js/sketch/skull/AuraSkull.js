import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import Skull from './Skull';
import AuraPostEffect from './AuraPostEffect';
import Aura from './Aura';
import Points from './Points';

export default class AuraSkull extends THREE.Group {
  constructor() {
    super();
    this.name = 'AuraSkull';
    this.skull;
    this.auraPostEffect;
    this.aura;
    this.points;
    this.renderTarget1 = new THREE.WebGLRenderTarget(256, 256);
    this.renderTarget2 = new THREE.WebGLRenderTarget(256, 256);
    this.time = 0;
    this.isActive = false;
  }
  start(geometry1, geometry2, noiseTex) {
    this.skull = new Skull(geometry1, geometry2);
    this.auraPostEffect = new AuraPostEffect();
    this.aura = new Aura();
    this.points = new Points();

    this.add(this.skull);
    this.add(this.aura);
    this.add(this.points);

    this.skull.start(noiseTex);
    this.aura.start(this.renderTarget1.texture, noiseTex);
    this.points.start(noiseTex);

    this.isActive = true;
  }
  update(time, renderer, camera, sceneAura, cameraAura, dd) {
    if (this.isActive === false) return;

    // update the attributes of this group.
    this.time += time;
    this.radian += time;

    if (dd) {
      this.skull.rotation.set(
        MathEx.radians(dd.v.y - 15),
        MathEx.radians(dd.v.x + 15),
        MathEx.radians(-20)
      );
    }

    // update children.
    this.skull.update(time, camera);
    this.aura.update(time, camera);
    this.points.update(time);

    // processing before rendering the aura as texture.
    renderer.setRenderTarget(this.renderTarget1);
    sceneAura.add(this.skull);
    this.skull.material.uniforms.renderOutline.value = 1;

    // rendering the aura as texture.
    renderer.render(sceneAura, cameraAura);

    // processing before rendering the post effect.
    renderer.setRenderTarget(this.renderTarget2);
    sceneAura.remove(this.skull);
    sceneAura.add(this.auraPostEffect);
    this.auraPostEffect.setDirection(1, 0);
    this.auraPostEffect.setTexture(this.renderTarget1.texture);

    // rendering Gaussian Blur to direction X.
    renderer.render(sceneAura, cameraAura);

    // processing before rendering the post effect.
    renderer.setRenderTarget(this.renderTarget1);
    this.auraPostEffect.setDirection(0, 1);
    this.auraPostEffect.setTexture(this.renderTarget2.texture);

    // rendering Gaussian Blur to direction Y.
    renderer.render(sceneAura, cameraAura);

    // processing after rendering the aura as texture.
    renderer.setRenderTarget(null);
    sceneAura.remove(this.auraPostEffect);
    this.add(this.skull);
    this.skull.material.uniforms.renderOutline.value = 0;
  }
  resize(resolution) {
    this.points.resize(resolution);
  }
}
