import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import vs from './glsl/Plane.vs';
import fs from './glsl/Plane.fs';

const SEGMENT_X = 9;
const SEGMENT_Y = 18;

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
    const hookes = [];

    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(15, 15, SEGMENT_X, SEGMENT_Y);
    const { count } = geometry.attributes.position;
    const { uv } = geometry.attributes;
    const baHookesIndices = new THREE.BufferAttribute(new Float32Array(count), 1);

    for (let i = 0; i < count; i++) {
      const x = Math.round(uv.getX(i) * SEGMENT_X);
      const y = Math.round(SEGMENT_Y - uv.getY(i) * SEGMENT_Y);

      hookes.push({
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3()
      });
      baHookesIndices.setXYZ(i, x + y * (SEGMENT_X + 1));
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
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Plane';
    this.anchor = new THREE.Vector3();
    this.top = new THREE.Vector3(0, 1, 0);
    this.hookes = hookes;
  }
  start(noiseTex) {
    const { uniforms } = this.material;
    const { position, hookesIndex } = this.geometry.attributes;

    uniforms.noiseTex.value = noiseTex;

    for (let i = 0; i < hookesIndex.array.length; i++) {
      const index = hookesIndex.getX(i);
      const { velocity } = this.hookes[index];

      velocity.set(
        position.getX(i),
        position.getY(i),
        position.getZ(i)
      );
    }
  }
  update(time, core) {
    const { uniforms } = this.material;
    const { position, hookesIndex } = this.geometry.attributes;
    const dir = core.acceleration.clone().normalize();
    const axis = new THREE.Vector3().crossVectors(this.top, dir);
    const angle = Math.acos(dir.clone().dot(this.top)) * core.acceleration.distanceTo(new THREE.Vector3());
    const rotateMat = new THREE.Matrix4().makeRotationAxis(axis, angle);

    uniforms.time.value += time;

    for (let i = 0; i < this.hookes.length; i++) {
      const { velocity, acceleration } = this.hookes[i];
      const index = hookesIndex.getX(i);
      const k = Math.max(index - SEGMENT_X - 1, -1);

      if (k > -1) {
        const anchor = this.hookes[k].velocity;

        applyHook(velocity, acceleration, anchor, 1, 1.2);
        applyDrag(acceleration, 0.7);
        velocity.add(acceleration);
      } else {
        velocity
          .copy(core.position)
          .add(
            new THREE.Vector3(
              Math.cos(MathEx.radians(i / SEGMENT_X * 360)) * 15,
              0,
              Math.sin(MathEx.radians(i / SEGMENT_X * 360)) * 15,
            ).applyMatrix4(rotateMat)
          );
      }
      position.setXYZ(index, velocity.x, velocity.y, velocity.z);
      position.needsUpdate = true;
    }
    for (let i = 0; i < this.hookes.length; i++) {
      const { normal } = this.geometry.attributes;
      const index = hookesIndex.getX(i);
      const i2 = (i <= SEGMENT_X) ? i + SEGMENT_X + 1 : i - SEGMENT_X - 1;
      const i3 = (i % (SEGMENT_X + 1) === 0) ? i + 1 : i - 1;
      const v1 = this.hookes[i].velocity;
      const v2 = this.hookes[i2].velocity;
      const v3 = this.hookes[i3].velocity;
      const n1 = v1.clone().sub(v2).normalize();
      const n2 = v1.clone().sub(v3).normalize();
      let cross;

      if (i <= SEGMENT_X && i % (SEGMENT_X + 1) === 0) {
        cross = n1.cross(n2)
      } else if (i <= SEGMENT_X || i % (SEGMENT_X + 1) === 0) {
        cross = n2.cross(n1)
      } else {
        cross = n1.cross(n2)
      }
      normal.setXYZ(index, cross.x, cross.y, cross.z);
      normal.needsUpdate = true;
    }
  }
}
