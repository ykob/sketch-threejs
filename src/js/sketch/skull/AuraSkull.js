import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import Skull from './Skull';
import Aura from './Aura';

export default class AuraSkull extends THREE.Group {
  constructor() {
    super();
    this.name = 'AuraSkull';
    this.skull;
    this.aura;
    this.renderTarget = new THREE.WebGLRenderTarget(512, 512);
    this.time = 0;
    this.isActive = false;
  }
  start(geometry1, geometry2, noiseTex) {
    this.skull = new Skull(geometry1, geometry2);
    this.aura = new Aura();

    this.add(this.skull);
    this.add(this.aura);

    this.skull.start();
    this.aura.start(this.renderTarget.texture, noiseTex);

    this.isActive = true;
  }
  update(time, renderer, scene, camera, cameraAura) {
    if (this.isActive === false) return;

    // update the attributes of this group.
    this.time += time;
    this.radian += time;

    // update children.
    this.skull.update(time, camera);
    this.aura.update(time, camera);

    // processing before rendering the aura as texture.
    renderer.setRenderTarget(this.renderTarget);
    scene.add(this.skull);
    this.skull.material.uniforms.renderOutline.value = 1;

    // rendering the aura as texture.
    renderer.render(scene, cameraAura);

    // processing after rendering the aura as texture.
    renderer.setRenderTarget(null);
    scene.remove(this.skull);
    this.add(this.skull);
    this.skull.material.uniforms.renderOutline.value = 0;
  }
  resize(camera) {
  }
}
