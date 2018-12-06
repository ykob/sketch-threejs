import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

export default class BoarHead {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
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
    this.obj;
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
    this.uniforms.dissolveEdge.value = holdV * 0.0065;

    this.a.copy(this.anchor).sub(this.v).divideScalar(10);
    this.v.add(this.a);
    this.obj.rotation.setFromVector3(this.v);
    this.obj.position.set(
      (Math.random() * 2 - 1) * holdV * 0.01,
      (Math.random() * 2 - 1) * holdV * 0.01,
      (Math.random() * 2 - 1) * holdV * 0.01
    )
  }
}
