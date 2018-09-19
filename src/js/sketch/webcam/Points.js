const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Points {
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
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    for (var i = 0; i < 200 * 3; i += 3) {
      const radius = Math.random() * Math.random() * 20 + 30;
      const radian = MathEx.radians(Math.random() * 360);
      positions[i + 0] = Math.cos(radian) * radius;
      positions[i + 1] = Math.sin(radian) * radius;
      positions[i + 2] = 0;
    }
    const baPositions = new THREE.BufferAttribute(new Float32Array(positions), 3);
    geometry.addAttribute('position', baPositions);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/points.vs'),
      fragmentShader: glslify('./glsl/points.fs'),
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Points(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
