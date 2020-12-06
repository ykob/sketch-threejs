import * as THREE from 'three';

import vs from './glsl/Plane.vs';
import fs from './glsl/Plane.fs';

const SEGMENT = 3;
const hookes = [];

export default class Plane extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(30, 30, SEGMENT, SEGMENT);
    const { count } = geometry.attributes.position;
    const { uv } = geometry.attributes;
    const baHookesIndices = new THREE.BufferAttribute(new Float32Array(count), 1);

    for (let i = 0; i < count; i++) {
      const x = Math.floor(uv.getX(i) * SEGMENT);
      const y = SEGMENT - Math.floor(uv.getY(i) * SEGMENT);

      hookes.push({
        velocity: new THREE.Vector3(),
        accleration: new THREE.Vector3()
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
  }
  start(noiseTex) {
    const uv = this.geometry.attributes.uv.array;
    const { uniforms } = this.material;

    uniforms.noiseTex.value = noiseTex;

    console.log(this.geometry);
    for (let i = 0; i < uv.length; i += 2) {
      const x = Math.floor(uv[i + 0] * SEGMENT);
      const y = SEGMENT - Math.floor(uv[i + 1] * SEGMENT);
      console.log(x, y);
    }
  }
  update(time) {
    const { uniforms } = this.material;

    uniforms.time.value += time;
  }
}
