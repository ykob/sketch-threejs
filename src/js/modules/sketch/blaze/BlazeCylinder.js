const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class BlazeCylinder {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj = null;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(1000, 3000, 128, 128);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/blaze/blazeCylinder.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/blaze/blazeCylinder.fs'),
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
