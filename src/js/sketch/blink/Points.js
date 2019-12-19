const THREE = require('three');

export default class Points {
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
    const geometry = new THREE.BufferGeometry();

    // Add attributes
    const position = [];
    const SIDE = 50;
    const LENGTH = 70;
    for (var z = 0; z < SIDE; z++) {
      for (var y = 0; y < SIDE; y++) {
        for (var x = 0; x < SIDE; x++) {
          const px = ((x / SIDE) * 2 - 1) * LENGTH;
          const py = ((y / SIDE) * 2 - 1) * LENGTH;
          const pz = ((z / SIDE) * 2 - 1) * LENGTH;
          position.push(px, py, pz);
        }
      }
    }
    const attrPosition = new THREE.BufferAttribute(new Float32Array(position), 3);
    geometry.setAttribute('position', attrPosition);

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
  render(time) {
    this.uniforms.time.value += time;
    this.obj.rotation.set(
      this.uniforms.time.value * 0.005,
      this.uniforms.time.value * 0.02,
      this.uniforms.time.value * 0.004
    )
  }
}
