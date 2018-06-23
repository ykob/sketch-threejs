const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class GUI {
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
    this.num = 6;
    this.obj = null;
  }
  createObj(textures) {
    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneBufferGeometry(1200, 1200, 2, 2);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const instancePosition = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3, 1);
    const rotate1 = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    const rotate2 = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    const rotate3 = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    const h = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1, 1);
    for ( let i = 0, ul = this.num; i < ul; i++ ) {
      instancePosition.setXYZ(i, 0, 0, (this.num - i) * -150);
      rotate1.setXYZ(i, Math.random() * 2 - 1);
      rotate2.setXYZ(i, Math.random() * 2 - 1);
      rotate3.setXYZ(i, Math.random() * 2 - 1);
      h.setXYZ(i, (Math.random() * 2 - 1) * 0.15);
    }
    geometry.addAttribute('instancePosition', instancePosition);
    geometry.addAttribute('rotate1', rotate1);
    geometry.addAttribute('rotate2', rotate2);
    geometry.addAttribute('rotate3', rotate3);
    geometry.addAttribute('h', h);

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
