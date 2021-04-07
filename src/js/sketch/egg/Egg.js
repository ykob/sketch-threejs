const THREE = require('three');


export default class Egg {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      noiseRange: {
        type: 'f',
        value: Math.random() * 3
      },
      speed: {
        type: 'f',
        value: 0.08
      },
      circleOutStepMin: {
        type: 'f',
        value: 0.1
      },
      circleOutStepMax: {
        type: 'f',
        value: 1.0
      },
      circleInStepMin: {
        type: 'f',
        value: 0.0
      },
      circleInStepMax: {
        type: 'f',
        value: 0.3
      },
      noisePosition: {
        type: 'f',
        value: 0.8
      },
      noiseSize: {
        type: 'f',
        value: 0.5
      },
    };
    this.obj = this.createObj();
  }
  createObj() {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(640, 640),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/egg.vs').default,
        fragmentShader: require('./glsl/egg.fs').default,
        transparent: true
      })
    );
    mesh.position.set(80, 0, 0);
    return mesh;
  }
  render(time) {
    if (!this.obj.visible) return;
    this.uniforms.time.value += time;
  }
}
