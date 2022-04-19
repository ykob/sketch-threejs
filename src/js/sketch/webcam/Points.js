const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class Points {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      force: {
        type: 'f',
        value: 0
      },
    };
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const delays = [];
    for (var i = 0; i < 200 * 3; i += 3) {
      const radius = Math.random() * Math.random() * 60 + 20;
      const radian = MathEx.radians(Math.random() * 360);
      positions[i + 0] = Math.cos(radian) * radius;
      positions[i + 1] = Math.sin(radian) * radius;
      positions[i + 2] = 0;
      delays[i / 3] = Math.random() * 8;
    }
    const baPositions = new THREE.BufferAttribute(new Float32Array(positions), 3);
    const baDelays = new THREE.BufferAttribute(new Float32Array(delays), 1);
    geometry.setAttribute('position', baPositions);
    geometry.setAttribute('delay', baDelays);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/points.vs').default,
      fragmentShader: require('./glsl/points.fs').default,
      transparent: true,
      depthWrite: false,
    });

    // Create Object3D
    this.obj = new THREE.Points(geometry, material);
  }
  render(time, force) {
    this.uniforms.force.value = force;
    this.uniforms.time.value += time * (force * 1.2);
  }
}
