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
    const aFirstArray = [];
    const vFirstArray = [];
    const delayArray = [];
    const massArray = [];

    for (var i = 0; i < COUNT * 3; i+= 3) {
      const radian = MathEx.radians(Math.random() * 360);
      const radiusA = 5;
      const radiusV = 30;

      aArrayBase[i + 0] = 3;
      aArrayBase[i + 1] = Math.cos(radian) * radiusA;
      aArrayBase[i + 2] = Math.sin(radian) * radiusA;

      vArrayBase[i + 0] = -499.99;
      vArrayBase[i + 1] = Math.cos(radian) * radiusV;
      vArrayBase[i + 2] = Math.sin(radian) * radiusV;

      aFirstArray[i + 0] = aArrayBase[i + 0];
      aFirstArray[i + 1] = aArrayBase[i + 1];
      aFirstArray[i + 2] = aArrayBase[i + 2];

      vFirstArray[i + 0] = vArrayBase[i + 0];
      vFirstArray[i + 1] = vArrayBase[i + 1];
      vFirstArray[i + 2] = vArrayBase[i + 2];

      delayArray[i + 0] = Math.random() * 5;
      delayArray[i + 1] = 0;
      delayArray[i + 2] = 0;

      massArray[i + 0] = Math.random();
      massArray[i + 1] = 0;
      massArray[i + 2] = 0;
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
          accelerationFirst: {
            value: this.physicsRenderers[i].createDataTexture(aFirstArray)
          },
          delay: {
            value: this.physicsRenderers[i].createDataTexture(delayArray)
          },
          mass: {
            value: this.physicsRenderers[i].createDataTexture(massArray)
          },
          multiTime: {
            value: this.multiTime
          }
        });
        this.physicsRenderers[i].mergeVUniforms({
          delay: {
            value: this.physicsRenderers[i].createDataTexture(delayArray)
          },
          velocityFirst: {
            value: this.physicsRenderers[i].createDataTexture(vFirstArray)
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
          mass: {
            value: this.physicsRenderers[i].createDataTexture(massArray)
          },
          prevVelocity: {
            value: this.physicsRenderers[i - 1].getCurrentVelocity()
          },
          headVelocity: {
            value: this.physicsRenderers[0].getCurrentVelocity()
          }
        });
        this.physicsRenderers[i].mergeVUniforms({
          velocityFirst: {
            value: this.physicsRenderers[i].createDataTexture(vFirstArray)
          },
          headVelocity: {
            value: this.physicsRenderers[0].getCurrentVelocity()
          }
        });
      }
    }

    this.core.start(this.physicsRenderers[0]);
    this.trail.start(this.physicsRenderers);
    this.add(this.core);
    this.add(this.trail);
  }
  update(renderer, time) {
    for (let i = 0; i < this.physicsRenderers.length; i++) {
      const fr = this.physicsRenderers[i];
      if (i !== 0) {
        fr.aUniforms.prevVelocity.value = this.physicsRenderers[i - 1].getCurrentVelocity()
        fr.aUniforms.headVelocity.value = this.physicsRenderers[0].getCurrentVelocity()
        fr.vUniforms.headVelocity.value = this.physicsRenderers[0].getCurrentVelocity()
      }
      fr.update(renderer, time);
    }
    this.core.update(this.physicsRenderers[0], time);
    this.trail.update(this.physicsRenderers, time);
  }
}
