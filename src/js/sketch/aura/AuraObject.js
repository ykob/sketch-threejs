import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import TorusKnot from './TorusKnot';
import Aura from './Aura';

export default class AuraObject extends THREE.Group {
  constructor(alpha) {
    super();
    this.name = 'AuraObject';
    this.obj = new TorusKnot();
    this.aura = new Aura();
    this.add(this.aura);
    this.add(this.obj);

    this.renderTarget = new THREE.WebGLRenderTarget(512, 512);
    this.alpha = alpha;
    this.radian = MathEx.radians(alpha * 360);
    this.time = 0;
    this.isActive = false;
  }
  start(noiseTex) {
    this.obj.start(this.alpha);
    this.aura.start(this.alpha, this.renderTarget.texture, noiseTex);
    this.isActive = true;
  }
  update(time, renderer, scene, camera, cameraAura) {
    if (this.isActive === false) return;

    // update the attributes of this group.
    this.time += time;
    this.radian += time;

    // update children.
    this.obj.update(time, camera);
    this.aura.update(time, camera);

    // processing before rendering the aura as texture.
    renderer.setRenderTarget(this.renderTarget);
    scene.add(this.obj);
    this.obj.material.uniforms.renderOutline.value = 1;

    // rendering the aura as texture.
    renderer.render(scene, cameraAura);

    // processing after rendering the aura as texture.
    renderer.setRenderTarget(null);
    scene.remove(this.obj);
    this.add(this.obj);
    this.obj.material.uniforms.renderOutline.value = 0;

    // update the position of this group.
    this.position.set(
      Math.cos(this.radian) * 11,
      0,
      Math.sin(this.radian) * 11,
    );
  }
  resize(camera) {
  }
}
