import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

export default class BoarHead {
  constructor() {
    this.uniforms = {
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
    };
    this.v = new THREE.Vector3(0, 0, 0);
    this.a = new THREE.Vector3();
    this.anchor = new THREE.Vector3(0, 0, 0);
    this.sv = new THREE.Vector3(0, 0, 0);
    this.sa = new THREE.Vector3();
    this.sanchor = new THREE.Vector3(0, 0, 0);
    this.obj;
    this.isOvered = false;
    this.isCoolDowned = false;
  }
  createObj(geometry) {
    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/boarHead.vs'),
      fragmentShader: require('./glsl/boarHead.fs'),
      flatShading: true,
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  rotate(rotateX, rotateY) {
    this.anchor.set(rotateX, rotateY, 0);
  }
  render(time, holdV) {
    this.uniforms.time.value += time;
    this.uniforms.dissolveEdge.value = holdV * 0.0055;

    // rotate
    this.a.copy(this.anchor).sub(this.v).divideScalar(10);
    this.v.add(this.a);
    this.obj.rotation.setFromVector3(this.v);

    // shake and scale
    this.sa.copy(this.sanchor).sub(this.sv).divideScalar(10);
    if (this.isOvered === false) this.sa.addScalar(holdV * 0.2);
    this.sv.add(this.sa);

    const shake = (this.sv.length() + 1) * 0.01;
    const scale = this.sv.length() * 0.001 + 1;

    if (this.isCoolDowned === false) {
      this.obj.scale.set(scale, scale, scale);
      this.obj.position.set(
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
    this.isCoolDowned = false;
  }
}
