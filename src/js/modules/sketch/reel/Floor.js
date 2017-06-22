import Projector from './Projector.js';

const glslify = require('glslify');

export default class Floor {
  constructor() {
    this.projector = new Projector(90, 1, 1, 100);
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      texture: {
        type: 't',
        value: null
      },
      textureMatrix: {
        type: 'm4',
        value: this.projector.textureMatrix
      },
    };
    this.projector.position.set(0, 500, -500);
    this.projector.lookAt(new THREE.Vector3(0, 0, 0));
    const loader = new THREE.TextureLoader();
    loader.load(
      '/sketch-threejs/img/sketch/image_data/elephant.png',
      (tex) => {
      this.uniforms.texture.value = tex;
    })
    this.obj = this.createObj();
  }
  createObj() {
    const geometry = new THREE.PlaneBufferGeometry(3000, 3000)
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/reel/floor.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/floor.fs'),
        side: THREE.BackSide
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
    this.projector.updateTextureMatrix();
  }
}
