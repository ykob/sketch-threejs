const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class FloatPoints {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.num = 2000;
    this.obj;
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Define Material
    const position = new THREE.BufferAttribute(new Float32Array(this.num * 3), 3, 1);
    const delay = new THREE.BufferAttribute(new Float32Array(this.num), 1, 1);
    const speed = new THREE.BufferAttribute(new Float32Array(this.num), 1, 1);
    for ( var i = 0, ul = this.num; i < ul; i++ ) {
      const radian1 = MathEx.radians(MathEx.randomArbitrary(0, 150) - 75);
      const radian2 = MathEx.radians(MathEx.randomArbitrary(0, 360));
      const radius = MathEx.randomArbitrary(600, 2500);
      const spherical = MathEx.spherical(radian1, radian2, radius);
      position.setXYZ(i, spherical[0], spherical[1], spherical[2]);
      delay.setXYZ(i, Math.random());
      speed.setXYZ(i, MathEx.randomArbitrary(5, 10) * (MathEx.randomInt(0, 1) * 2.0 - 1.0));
    }
    geometry.setAttribute('position', position);
    geometry.setAttribute('delay', delay);
    geometry.setAttribute('speed', speed);

    // Materialを定義
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/floatPoints.vs').default,
      fragmentShader: require('./glsl/floatPoints.fs').default,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Object3Dを作成
    this.obj = new THREE.Points(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
