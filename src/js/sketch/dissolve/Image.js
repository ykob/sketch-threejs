import * as THREE from 'three';

export default class Mesh extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        interval: {
          type: 'f',
          value: 5
        },
        duration: {
          type: 'f',
          value: 3
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2(),
        },
        imageResolution: {
          type: 'v2',
          value: new THREE.Vector2(2048, 1356),
        },
        textures: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: require('./glsl/image.vs').default,
      fragmentShader: require('./glsl/image.fs').default,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'Mesh';
  }
  start(resolution, textures) {
    this.resize(resolution);
    for (var i = 0; i < textures.length; i++) {
      textures[i].magFilter = THREE.NearestFilter;
      textures[i].minFilter = THREE.NearestFilter;
    }
    this.material.uniforms.textures.value = textures;
  }
  update(time) {
    this.material.uniforms.time.value += time;
  }
  resize(resolution) {
    this.material.uniforms.resolution.value.copy(resolution);
  }
}
