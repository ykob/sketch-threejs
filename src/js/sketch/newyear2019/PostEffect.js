import * as THREE from 'three';

export default class PostEffect {
  constructor(texture1, texture2) {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0,
      },
      texture1: {
        type: 't',
        value: texture1,
      },
      texture2: {
        type: 't',
        value: texture2,
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(),
      },
    };
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/postEffect.vs'),
      fragmentShader: require('./glsl/postEffect.fs'),
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  resize(x, y) {
    this.uniforms.resolution.value.set(x, y);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
