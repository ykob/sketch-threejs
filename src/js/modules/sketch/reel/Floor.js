import Projector from './Projector.js';

const glslify = require('glslify');

export default class Floor {
  constructor() {
    this.projector = new Projector();
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
      projectorPosition: {
        type: 'v3',
        value: this.projector.position
      }
    };
    this.obj = this.createObj();

  }
  createObj() {
    const geometry = new THREE.PlaneBufferGeometry(3000, 3000);
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/reel/floor.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/floor.fs'),
        transparent: true
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
    this.projector.updateTextureMatrix();
  }
}
