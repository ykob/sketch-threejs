const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class Fog {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      tex: {
        type: 't',
        value: null
      }
    };
    this.num = 200;
    this.obj;
  }
  createObj(tex) {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneGeometry(1100, 1100, 20, 20);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3);
    const delays = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1);
    const rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1);
    for ( var i = 0, ul = this.num; i < ul; i++ ) {
      instancePositions.setXYZ(
        i,
        (Math.random() * 2 - 1) * 850,
        0,
        (Math.random() * 2 - 1) * 300,
      );
      delays.setXYZ(i, Math.random());
      rotates.setXYZ(i, Math.random() * 2 + 1);
    }
    geometry.setAttribute('instancePosition', instancePositions);
    geometry.setAttribute('delay', delays);
    geometry.setAttribute('rotate', rotates);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/fog.vs').default,
      fragmentShader: require('./glsl/fog.fs').default,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.uniforms.tex.value = tex;

    // Create Object3D
    this.obj = new THREE.InstancedMesh(geometry, material, this.num);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
