import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import MoverCore from './MoverCore';
import MoverTrail from './MoverTrail';
import PhysicsRenderer from './PhysicsRenderer';

import vsa from './glsl/physicsRendererAcceleration.vs';
import fsa from './glsl/physicsRendererAcceleration.fs';
import vsa2 from './glsl/physicsRendererAcceleration2.vs';
import fsa2 from './glsl/physicsRendererAcceleration2.fs';
import vsv from './glsl/physicsRendererVelocity.vs';
import fsv from './glsl/physicsRendererVelocity.fs';
import vsv2 from './glsl/physicsRendererVelocity2.vs';
import fsv2 from './glsl/physicsRendererVelocity2.fs';

const COUNT = 5000;
const HEIGHT_SEGMENTS = 5;

export default class Mover extends THREE.Group {
  constructor() {
    super();

    this.name = 'Mover';
    this.core = new MoverCore(COUNT);
    this.trail = new MoverTrail(COUNT, HEIGHT_SEGMENTS);
    this.physicsRenderers = [];
    this.multiTime = new THREE.Vector2(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
  }
  start(renderer, noiseTex) {
    // Define PhysicsRenderer
    const aArrayBase = [];
    const vArrayBase = [];
    const hOptArrayBase = [];

    for (var i = 0; i < COUNT * 3; i+= 3) {
      const radian = MathEx.radians(Math.random() * 360);
      const radius = 300;

      vArrayBase[i + 0] = Math.cos(radian) * radius;
      vArrayBase[i + 1] = Math.sin(radian) * radius;
      vArrayBase[i + 2] = Math.random() * 2 - 1;

      hOptArrayBase[i + 0] = Math.random() * 0.02 + 0.08;
      hOptArrayBase[i + 1] = Math.random() * 0.01 + 0.02;
      hOptArrayBase[i + 2] = 0;
    }

    for (let i = 0; i < HEIGHT_SEGMENTS; i++) {
      if (i === 0) {
        this.physicsRenderers[i] = new PhysicsRenderer(vsa, fsa, vsv, fsv);
        this.physicsRenderers[i].start(
          renderer,
          aArrayBase,
          vArrayBase
        );
        this.physicsRenderers[i].mergeAUniforms({
          noiseTex: {
            value: noiseTex
          },
          multiTime: {
            value: this.multiTime
          },
          anchor: {
            value: new THREE.Vector3()
          },
          hookOptions: {
            value: this.physicsRenderers[0].createDataTexture(hOptArrayBase)
          }
        });
      } else {
        this.physicsRenderers[i] = new PhysicsRenderer(vsa2, fsa2, vsv2, fsv2);
        this.physicsRenderers[i].start(
          renderer,
          null,
          vArrayBase
        );
        this.physicsRenderers[i].mergeAUniforms({
          prevVelocity: {
            value: this.physicsRenderers[i - 1].getCurrentVelocity()
          }
        });
      }
    }

    this.core.start(this.physicsRenderers[0]);
    this.trail.start(this.physicsRenderers);
    this.add(this.core);
    this.add(this.trail);
  }
  update(renderer, time, core) {
    for (let i = 0; i < this.physicsRenderers.length; i++) {
      const fr = this.physicsRenderers[i];
      if (i === 0) {
        fr.aUniforms.anchor.value.copy(core.position);
      } else {
        fr.aUniforms.prevVelocity.value = this.physicsRenderers[i - 1].getCurrentVelocity()
      }
      fr.update(renderer, time);
    }
    this.core.update(this.physicsRenderers[0], time);
    this.trail.update(this.physicsRenderers, time);
  }
}
