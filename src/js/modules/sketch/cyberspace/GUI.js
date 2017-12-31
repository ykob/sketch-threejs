const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Mesh {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      texture1: {
        type: 't',
        value: null
      },
      texture2: {
        type: 't',
        value: null
      },
      texture3: {
        type: 't',
        value: null
      },
    };
    this.obj = null;
  }
  createObj(textures) {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(1000, 1000, 2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/cyberspace/gui.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/cyberspace/gui.fs'),
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    this.uniforms.texture1.value = textures[0];
    this.uniforms.texture2.value = textures[1];
    this.uniforms.texture3.value = textures[2];

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
