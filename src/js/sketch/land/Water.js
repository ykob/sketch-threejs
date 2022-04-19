const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class Water {
  constructor(h) {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      addH: {
        type: 'f',
        value: h - 0.5
      },
    };
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(100, 100, 60, 60);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/water.vs').default,
      fragmentShader: require('./glsl/water.fs').default,
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.translateY(8);
    this.obj.rotation.set(MathEx.radians(-90), 0, 0);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
