import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/NodePoints.vs';
import fs from './glsl/NodePoints.fs';

const NUM = 100;
const R = new THREE.Vector2();
const V = new THREE.Vector3();
const A = new THREE.Vector3();

const getViewSize = (camera) => {
  const fovInRadians = (camera.fov * Math.PI) / 180;
  const height = Math.abs(
    camera.position.z * Math.tan(fovInRadians / 2) * 2
  );
  R.set(height * camera.aspect, height);
}

export default class NodePoints extends THREE.Points {
  constructor(camera) {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    const baPositions = new THREE.BufferAttribute(new Float32Array(NUM * 3), 3);
    const baAcceralations = new THREE.BufferAttribute(new Float32Array(NUM * 3), 3);
    const baSizes = new THREE.BufferAttribute(new Float32Array(NUM), 1);

    getViewSize(camera);

    for (var i = 0; i < NUM; i++) {
      baPositions.setXYZ(
        i,
        R.x * (Math.random() - 0.5),
        R.y * (Math.random() - 0.5),
        0
      );
      const size = Math.random() * 6 + 1;
      const radians = MathEx.radians(Math.random() * 360);
      baAcceralations.setXYZ(
        i,
        Math.cos(radians) * (0.1 - size * 0.01),
        Math.sin(radians) * (0.1 - size * 0.01),
        0
      );
      baSizes.setX(i, size);
    }

    geometry.setAttribute('position', baPositions);
    geometry.setAttribute('acceralation', baAcceralations);
    geometry.setAttribute('size', baSizes);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthTest: false,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'NodePoints';
  }
  start() {

  }
  update(time, camera) {
    getViewSize(camera);

    for (var i = 0; i < NUM; i++) {
      V.set(
        this.geometry.attributes.position.getX(i),
        this.geometry.attributes.position.getY(i),
        this.geometry.attributes.position.getZ(i)
      );
      A.set(
        this.geometry.attributes.acceralation.getX(i),
        this.geometry.attributes.acceralation.getY(i),
        this.geometry.attributes.acceralation.getZ(i)
      );

      V.add(A);

      if (V.x >= R.x * 0.6) {
        V.x = -R.x * 0.6;
      } else if (V.x < R.x * -0.6) {
        V.x = R.x * 0.6;
      }
      if (V.y >= R.y * 0.6) {
        V.y = -R.y * 0.6;
      } else if (V.y < R.y * -0.6) {
        V.y = R.y * 0.6;
      }

      this.geometry.attributes.position.setXYZ(i, V.x, V.y, V.z);
      this.geometry.attributes.acceralation.setXYZ(i, A.x, A.y, A.z);
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.acceralation.needsUpdate = true;
  }
}
