import * as THREE from 'three';

const texLoader = new THREE.TextureLoader();

export default class Typo extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(36, 36);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        time2: {
          type: 'f',
          value: 0
        },
        tex: {
          type: 't',
          value: null
        },
        drawBrightOnly: {
          type: 'f',
          value: 0
        },
      },
      vertexShader: require('./glsl/typo.vs').default,
      fragmentShader: require('./glsl/typo.fs').default,
      transparent: true,
    });

    // Create Object3D
    super(geometry, material);
    this.position.z = 40;
    this.isOver = false;
  }
  async loadTexture() {
    this.material.uniforms.tex.value = await texLoader.loadAsync(
      '/sketch-threejs/img/sketch/newyear2019/typo.png'
    );
  }
  render(time) {
    this.material.uniforms.time.value += time;
    if (this.isOver === true) this.material.uniforms.time2.value += time;
  }
  over(time) {
    this.material.uniforms.time2.value = 0;
    this.isOver = true;
  }
  coolDown() {
    this.isOver = false;
  }
}
