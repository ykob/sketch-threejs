import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

export default class BoarHead extends THREE.Mesh {
  constructor(geometry) {
    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: -2
        },
        drawBrightOnly: {
          type: 'f',
          value: 0
        },
        dissolveEdge: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: require('./glsl/boarHead.vs').default,
      fragmentShader: require('./glsl/boarHead.fs').default,
      transparent: true,
    });

    // Create Object3D
    super(geometry, material);

    this.v = new THREE.Vector3(0, 0, 0);
    this.a = new THREE.Vector3();
    this.anchor = new THREE.Vector3(0, 0, 0);
    this.sv = new THREE.Vector3(0, 0, 0);
    this.sa = new THREE.Vector3();
    this.sanchor = new THREE.Vector3(0, 0, 0);

    this.isOvered = false;
    this.isCoolDowned = false;
  }
  rotate(rotateX, rotateY) {
    this.anchor.set(rotateX, rotateY, 0);
  }
  render(time, holdV) {
    this.material.uniforms.time.value += time;
    this.material.uniforms.dissolveEdge.value = holdV * 0.0055;

    // rotate
    this.a.copy(this.anchor).sub(this.v).divideScalar(10);
    this.v.add(this.a);
    this.rotation.setFromVector3(this.v);

    // shake and scale
    this.sa.copy(this.sanchor).sub(this.sv).divideScalar(10);
    if (this.isOvered === false) this.sa.addScalar(holdV * 0.2);
    this.sv.add(this.sa);

    const shake = (this.sv.length() + 1) * 0.005;
    const scale = this.sv.length() * 0.0005 + 1;

    if (this.isCoolDowned === false) {
      this.scale.set(scale, scale, scale);
      this.position.set(
        (Math.random() * 2 - 1) * shake,
        (Math.random() * 2 - 1) * shake,
        (Math.random() * 2 - 1) * shake
      );
    }
  }
  over() {
    this.isOvered = true;
  }
  coolDown() {
    this.isOvered = false;
    this.isCoolDowned = true;
  }
  returnFirstState() {
    this.sv.set(0, 0, 0);
    this.sa.set(0, 0, 0);
    this.isCoolDowned = false;
  }
}
