import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import vs from './glsl/NodeLine.vs';
import fs from './glsl/NodeLine.fs';

const NUM = 1000;
const R = new THREE.Vector2();
const V1 = new THREE.Vector3();
const V2 = new THREE.Vector3();

const getViewSize = (camera) => {
  const fovInRadians = (camera.fov * Math.PI) / 180;
  const height = Math.abs(
    camera.position.z * Math.tan(fovInRadians / 2) * 2
  );
  R.set(height * camera.aspect, height);
}

export default class NodeLine extends THREE.LineSegments {
  constructor() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    const baPositions = new THREE.BufferAttribute(new Float32Array(NUM * 3 * 2), 3);
    const baOpacity = new THREE.BufferAttribute(new Float32Array(NUM * 2), 1);
    const indeces = [];

    for (var i = 0; i < NUM * 2; i++) {
      indeces.push(i);
    }

    geometry.setAttribute('position', baPositions);
    geometry.setAttribute('opacity', baOpacity);
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(indeces), 1));

    // Define Material
    const material = new THREE.RawShaderMaterial({
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      depthTest: false,
      linewidth: 1,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'NodeLine';
  }
  start() {
  }
  update(points, camera) {
    getViewSize(camera);

    let lineIndex = 0;
    for (var i = 0; i < points.geometry.attributes.position.count; i++) {
      for (var j = i + 1; j < points.geometry.attributes.position.count; j++) {
        V1.set(
          points.geometry.attributes.position.getX(i),
          points.geometry.attributes.position.getY(i),
          points.geometry.attributes.position.getZ(i)
        );
        V2.set(
          points.geometry.attributes.position.getX(j),
          points.geometry.attributes.position.getY(j),
          points.geometry.attributes.position.getZ(j)
        );
        const d = V1.distanceTo(V2);
        if (d < R.y * 0.15) {
          this.geometry.attributes.position.setXYZ(
            lineIndex * 2, V1.x, V1.y, V1.z
          );
          this.geometry.attributes.position.setXYZ(
            lineIndex * 2 + 1, V2.x, V2.y, V2.z
          );
          this.geometry.attributes.opacity.setXYZ(
            lineIndex * 2, (3 - d)
          );
          this.geometry.attributes.opacity.setXYZ(
            lineIndex * 2 + 1, (3 - d)
          );
          lineIndex++;
        }
        if (lineIndex >= NUM) continue;
      }
    }
    for (var k = (lineIndex + 1) * 2; k < this.geometry.attributes.position.count; k++) {
      this.geometry.attributes.position.setXYZ(
        k, 0, 0, 0
      );
    }
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.opacity.needsUpdate = true;
  }
}
