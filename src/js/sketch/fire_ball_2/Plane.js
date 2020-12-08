import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Plane.vs';
import fs from './glsl/Plane.fs';

const SEGMENT = 9;
const hookes = [];

const applyDrag = (acceleration, value) => {
  const force = acceleration.clone();

  force.multiplyScalar(-1);
  force.normalize();
  force.multiplyScalar(acceleration.length() * value);
  acceleration.add(force);
};
const applyHook = (position, acceleration, anchor, restLength, k) => {
  const force = position.clone().sub(anchor);
  const distance = force.length() - restLength;

  force.normalize();
  force.multiplyScalar(-1 * k * distance);
  acceleration.add(force);
};

export default class Plane extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(15, 15, SEGMENT, SEGMENT);
    const { count } = geometry.attributes.position;
    const { uv } = geometry.attributes;
    const baHookesIndices = new THREE.BufferAttribute(new Float32Array(count), 1);

    for (let i = 0; i < count; i++) {
      const x = Math.floor(uv.getX(i) * SEGMENT);
      const y = SEGMENT - Math.floor(uv.getY(i) * SEGMENT);

      hookes.push({
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3()
      });
      baHookesIndices.setXYZ(i, x + y * (SEGMENT + 1));
    }
    geometry.setAttribute('hookesIndex', baHookesIndices);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          value: 0
        },
        noiseTex: {
          value: null
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
      wireframe: true
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Plane';
    this.anchor = new THREE.Vector3();
  }
  start(noiseTex) {
    const { uniforms } = this.material;
    const { position, hookesIndex } = this.geometry.attributes;

    uniforms.noiseTex.value = noiseTex;

    for (let i = 0; i < hookesIndex.array.length; i++) {
      const index = hookesIndex.getX(i);
      const { velocity } = hookes[index];

      velocity.set(
        position.getX(i),
        position.getY(i),
        position.getZ(i)
      );
    }
  }
  update(time) {
    const { uniforms } = this.material;
    const { position, hookesIndex } = this.geometry.attributes;

    uniforms.time.value += time;

    for (let i = 0; i < hookes.length; i++) {
      const { velocity, acceleration } = hookes[i];
      const index = hookesIndex.getX(i);
      const k = Math.max(index - SEGMENT - 1, -1);

      if (k > -1) {
        const anchor = hookes[k].velocity;

        acceleration.add(new THREE.Vector3(0, 1.7, 0));
        applyHook(velocity, acceleration, anchor, 1, 0.74);
      } else {
        applyHook(
          velocity,
          acceleration,
          this.anchor
            .clone()
            .add(
              new THREE.Vector3(
                (i / SEGMENT * 2 - 1) * 10,
                0,
                Math.cos(MathEx.radians(((i / SEGMENT) * 2 - 1) * 90)) * 10,
              )),
          1,
          0.74
        );
      }
      applyDrag(acceleration, 0.7);
      velocity.add(acceleration);
      position.setXYZ(index, velocity.x, velocity.y, velocity.z);
      position.needsUpdate = true;
    }
  }
}
