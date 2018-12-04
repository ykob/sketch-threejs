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
    };
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
  render(time, rotateX, rotateY) {
    this.uniforms.time.value += time;
    this.obj.rotation.set(
      MathEx.radians(rotateX),
      MathEx.radians(rotateY),
      0
    );
  }
}
