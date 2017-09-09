const glslify = require('glslify');
const SIZE = 100;

export default class Points {
  constructor() {
    this.attr = {
      position: new THREE.BufferAttribute(new Float32Array(SIZE * 3), 3),
      color: new THREE.BufferAttribute(new Float32Array(SIZE * 3), 3),
      time: new THREE.BufferAttribute(new Float32Array(SIZE), 1),
    };
    this.geometry = new THREE.BufferGeometry();
    this.uniforms = {
      interval: {
        type: 'f',
        value: 3
      },
    };
    this.obj = this.createObj();
  }
  createObj() {
    this.geometry.addAttribute('position', this.attr.position);
    this.geometry.addAttribute('color', this.attr.color);
    this.geometry.addAttribute('time', this.attr.time);
    return new THREE.Points(
      this.geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/butterfly/points.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/butterfly/points.fs'),
        transparent: true,
        depthWrite: false,
      })
    );
  }
  render(time) {
    for (var i = 0; i < SIZE; i++) {
      const now = this.attr.time.getX(i);
      this.attr.time.setX(i, now + time);
      if (now >= this.uniforms.interval.value) {
        const radian = Math.random() * 360 * Math.PI / 180;
        const radius = Math.random() * 50 + 50;
        this.attr.time.setX(i, 0);
        this.attr.position.setXYZ(
          i,
          Math.cos(radian) * radius,
          Math.sin(radian) * radius,
          0
        );
      }
    }
    this.attr.position.needsUpdate = true;
    this.attr.time.needsUpdate = true;
  }
}
