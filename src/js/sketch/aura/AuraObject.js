import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

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
    this.radian = MathEx.radians(alpha * 360);
    this.time = 0;
    this.isActive = false;
  }
  start() {
    this.obj.start();
    this.aura.start(this.renderTarget.texture);
    this.isActive = true;
  }
  update(time, renderer, scene, camera, cameraAura) {
    if (this.isActive === false) return;

    this.time += time;
    this.radian += time;

    this.obj.update(time, camera);
    this.aura.update(time, camera);

    renderer.setRenderTarget(this.renderTarget);
    scene.add(this.obj);
    this.obj.material.uniforms.scale.value = 1;

    renderer.render(scene, cameraAura);

    renderer.setRenderTarget(null);
    scene.remove(this.obj);
    this.add(this.obj);
    this.obj.material.uniforms.scale.value = 0;

    this.position.set(
      Math.cos(this.radian) * 10,
      0,
      Math.sin(this.radian) * 10,
    );
  }
  resize(camera) {
  }
}
