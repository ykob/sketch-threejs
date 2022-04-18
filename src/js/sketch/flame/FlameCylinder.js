const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class FlameCylinder {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(1000, 3000, 128, 128);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/flameCylinder.vs').default,
      fragmentShader: require('./glsl/flameCylinder.fs').default,
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
