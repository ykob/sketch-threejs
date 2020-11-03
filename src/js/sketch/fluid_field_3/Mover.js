import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import PhysicsRenderer from './PhysicsRenderer';

import vs from './glsl/Mover.vs';
import fs from './glsl/Mover.fs';
import vsa from './glsl/physicsRendererAcceleration.vs';
import fsa from './glsl/physicsRendererAcceleration.fs';
import vsa2 from './glsl/physicsRendererAcceleration.vs';
import fsa2 from './glsl/physicsRendererAcceleration.fs';
import vsv from './glsl/physicsRendererVelocity.vs';
import fsv from './glsl/physicsRendererVelocity.fs';
import vsv2 from './glsl/physicsRendererVelocity.vs';
import fsv2 from './glsl/physicsRendererVelocity.fs';

const HEIGHT_SEGMENTS = 5;

export default class Mover extends THREE.InstancedMesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, HEIGHT_SEGMENTS);

    // Add common attributes
    geometry.copy(baseGeometry);

    // Define attributes of the geometry
    const count = 100;

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        acceleration: {
          value: null
        },
        velocity: {
          value: null
        },
        time: {
          value: 0
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide      
    });

    // Create Object3D
    super(geometry, material, count);
    this.name = 'Mover';
    this.frustumCulled = false;
    this.physicsRenderers = [];
    this.multiTime = new THREE.Vector2(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
  }
  start(renderer, noiseTex) {
    const { uniforms } = this.material;

    // Define PhysicsRenderer
    const aArrayBase = [];
    const vArrayBase = [];
    const aFirstArray = [];
    const vFirstArray = [];
    const massArray = [];

    for (var i = 0; i < this.count * 3; i+= 3) {
      const radian1 = MathEx.radians(Math.random() * 360);
      const radian2 = MathEx.radians(Math.random() * 360);
      const radius = 5;
      const spherical = MathEx.spherical(radian1, radian2, radius);

      aArrayBase[i + 0] = spherical[0] * 0.02;
      aArrayBase[i + 1] = spherical[1] * 0.02;
      aArrayBase[i + 2] = spherical[2] * 0.02;

      vArrayBase[i + 0] = spherical[0];
      vArrayBase[i + 1] = spherical[1];
      vArrayBase[i + 2] = spherical[2];

      aFirstArray[i + 0] = aArrayBase[i + 0] * 0.3;
      aFirstArray[i + 1] = aArrayBase[i + 1] * 0.3;
      aFirstArray[i + 2] = aArrayBase[i + 2] * 0.3;

      vFirstArray[i + 0] = vArrayBase[i + 0];
      vFirstArray[i + 1] = vArrayBase[i + 1];
      vFirstArray[i + 2] = vArrayBase[i + 2];

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
          mass: {
            value: this.physicsRenderers[i].createDataTexture(massArray)
          },
          multiTime: {
            value: this.multiTime
          }
        });
        this.physicsRenderers[i].mergeVUniforms({
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
          multiTime: {
            value: this.multiTime
          },
          prevVelocity: {
            value: this.physicsRenderers[i - 1].getCurrentVelocity()
          }
        });
        this.physicsRenderers[i].mergeVUniforms({
          velocityFirst: {
            value: this.physicsRenderers[i].createDataTexture(vFirstArray)
          }
        });
        uniforms[`velocity${i}`] = {
          value: this.physicsRenderers[i].getCurrentVelocity()
        };
      }
    }
    uniforms.acceleration.value = this.physicsRenderers[0].getCurrentAcceleration();
    uniforms.velocity.value = this.physicsRenderers[0].getCurrentVelocity();

    this.geometry.setAttribute(
      'uvVelocity',
      this.physicsRenderers[0].getBufferAttributeUv({
        instanced: true
      })
    );
  }
  update(renderer, time) {
    const { uniforms } = this.material;

    for (let i = 0; i < this.physicsRenderers.length; i++) {
      const fr = this.physicsRenderers[i];
      if (i !== 0) {
        fr.aUniforms.prevVelocity.value = fr.getCurrentVelocity()
      }
      fr.update(renderer, time);
      if (i === 0) {
        uniforms.acceleration.value = fr.getCurrentAcceleration();
        uniforms.velocity.value = fr.getCurrentVelocity();
      } else {
        uniforms[`velocity${i}`].value = fr.getCurrentVelocity();
      }
    }
    
    uniforms.time.value += time;
  }
}
