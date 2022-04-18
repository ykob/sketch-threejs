const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class LandmarkPoints {
  constructor() {
    this.positions = undefined;
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
    const num = 68;
    const geometry = new THREE.BufferGeometry();
    this.positions = new THREE.BufferAttribute(new Float32Array(num * 3), 3);
    geometry.setAttribute('position', this.positions);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/landmarkPoints.vs').default,
      fragmentShader: require('./glsl/landmarkPoints.fs').default,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    this.obj = new THREE.Points(geometry, material);
  }
  setPositions(landmarks, score, webcam) {
    const isFacing = (webcam.facingMode === 'user') ? -1 : 1;

    this.obj.visible = (score >= 0.3);
    if (landmarks === false) return;
    for (var i = 0; i < this.positions.count; i++) {
      this.positions.setXYZ(
        i,
        (landmarks[i][0] / webcam.resolution.x * 2 - 1) * 25 * isFacing,
        (landmarks[i][1] / webcam.resolution.y * 2 - 1) * -25,
        10
      );
    }
    this.positions.needsUpdate = true;
  }
  render(time, landmarks, score, webcam) {
    this.uniforms.time.value += time * (webcam.force.v * 1.2);
    this.setPositions(landmarks, score, webcam);
  }
}
