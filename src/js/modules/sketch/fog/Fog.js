const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

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
    this.obj = null;
  }
  createObj(tex) {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneBufferGeometry(1100, 1100, 20, 20);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.addAttribute('normal', baseGeometry.attributes.normal);
    geometry.addAttribute('uv', baseGeometry.attributes.uv);
    geometry.setIndex(baseGeometry.index);

    // Define attributes of the instancing geometry
    const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, 1);
    const delays = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    const rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
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
    geometry.addAttribute('instancePosition', instancePositions);
    geometry.addAttribute('delay', delays);
    geometry.addAttribute('rotate', rotates);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/fog/fog.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/fog/fog.fs'),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.uniforms.tex.value = tex;

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
