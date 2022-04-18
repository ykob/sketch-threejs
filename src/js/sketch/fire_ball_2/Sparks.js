import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/Sparks.vs';
import fs from './glsl/Sparks.fs';

const COUNT = 400;

export default class Sparks extends THREE.InstancedMesh {
  constructor() {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneGeometry(1, 1);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const ibaPositions = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 3), 3);
    const ibaDirections = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 3), 3);
    const ibaTimes = new THREE.InstancedBufferAttribute(new Float32Array(COUNT), 1);
    const ibaDurations = new THREE.InstancedBufferAttribute(new Float32Array(COUNT), 1);
    const ibaDistances = new THREE.InstancedBufferAttribute(new Float32Array(COUNT), 1);
    const ibaScales = new THREE.InstancedBufferAttribute(new Float32Array(COUNT), 1);
    const ibaRotates = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 3), 3);
    const ibaUvDiffs = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 2), 2);
    for (var i = 0, ul = COUNT; i < ul; i++) {
      const radian1 = MathEx.radians((Math.random() * 2 - 1) * 75);
      const radian2 = MathEx.radians(Math.random() * 360);
      const radius = 1;
      const spherical = MathEx.spherical(radian1, radian2, radius);

      ibaPositions.setXYZ(i, spherical[0] * 5, spherical[1] * 5, spherical[2] * 5);
      ibaDirections.setXYZ(i, spherical[0], spherical[1], spherical[2]);
      ibaTimes.setXYZ(i, 0 - Math.random() * 5);
      ibaDurations.setXYZ(i, 2 + Math.random() * 4);
      ibaDistances.setXYZ(i, 20 + Math.random() * 15);
      ibaScales.setXYZ(i, 1 + Math.random() * 1);
      ibaRotates.setXYZ(i, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
      ibaUvDiffs.setXYZ(i, Math.random() * 2 - 1, Math.random() * 2 - 1);
    }
    geometry.setAttribute('iPosition', ibaPositions);
    geometry.setAttribute('iDirection', ibaDirections);
    geometry.setAttribute('iTime', ibaTimes);
    geometry.setAttribute('iDuration', ibaDurations);
    geometry.setAttribute('iDistance', ibaDistances);
    geometry.setAttribute('iScale', ibaScales);
    geometry.setAttribute('iRotate', ibaRotates);
    geometry.setAttribute('iUvDiff', ibaUvDiffs);

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
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });

    // Create Object3D
    super(geometry, material, COUNT);
    this.name = 'Sparks';
    this.frustumCulled = false;
  }
  start(noiseTex) {
    const { uniforms } = this.material;

    uniforms.noiseTex.value = noiseTex;
  }
  update(time, core) {
    const { iPosition, iDirection, iTime, iDuration } = this.geometry.attributes;
    const { uniforms } = this.material;

    uniforms.time.value += time;
    for (let i = 0; i < iTime.count; i++) {
      const duration = iDuration.getX(i);
      let prevTime = iTime.getX(i);
      if (prevTime > duration || prevTime < 0 && prevTime + time > 0) {
        prevTime %= duration;
        iPosition.setXYZ(
          i,
          iDirection.getX(i) * 5 + core.position.x,
          iDirection.getY(i) * 5 + core.position.y,
          iDirection.getZ(i) * 5 + core.position.z
        );
      }
      iTime.setX(i, prevTime + time);
    }
    iPosition.needsUpdate = true;
    iTime.needsUpdate = true;
  }
}
