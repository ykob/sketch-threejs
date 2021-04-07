import * as THREE from 'three';

export default class PostEffect extends THREE.Mesh {
  constructor(texture1, texture2) {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
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
      },
      vertexShader: require('./glsl/postEffect.vs').default,
      fragmentShader: require('./glsl/postEffect.fs').default,
    });

    // Create Object3D
    super(geometry, material);
  }
  resize(x, y) {
    this.material.uniforms.resolution.value.set(x, y);
  }
  render(time) {
    this.material.uniforms.time.value += time;
  }
}
