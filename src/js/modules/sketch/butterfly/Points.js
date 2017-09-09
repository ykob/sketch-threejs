const glslify = require('glslify');
const SIZE = 400;
const INTERVAL = 3;

export default class Points {
  constructor() {
    this.attr = {
      position: new THREE.BufferAttribute(new Float32Array(SIZE * 3), 3),
      color: new THREE.BufferAttribute(new Float32Array(SIZE * 3), 3),
      index: new THREE.BufferAttribute(new Float32Array(SIZE), 1),
      valid: new THREE.BufferAttribute(new Float32Array(SIZE), 1),
    };
    this.geometry = new THREE.BufferGeometry();
    this.uniforms = {
      interval: {
        type: 'f',
        value: INTERVAL
      },
      time: {
        type: 'f',
        value: 0
      },
    };
    this.index = 0;
    this.obj = this.createObj();
    this.obj.renderOrder = 5;
  }
  createObj() {
    const indices = [];
    for (var i = 0; i < SIZE; i++) {
      this.attr.index.setX(i, i);
    }
    this.geometry.addAttribute('position', this.attr.position);
    this.geometry.addAttribute('color', this.attr.color);
    this.geometry.addAttribute('i', this.attr.index);
    this.geometry.addAttribute('valid', this.attr.valid);

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
    this.uniforms.time.value += time;
    for (var i = 0; i < SIZE; i++) {
      const time = (this.uniforms.time.value + this.attr.index.getX(i) / SIZE * INTERVAL) % INTERVAL;
      const isValid = this.attr.valid.getX(i);

      if (time >= INTERVAL && isValid == 1) {
        this.attr.valid.setX(i, 0);
      } else if (time <= INTERVAL && isValid == 0) {
        const radian = Math.random() * 360 * Math.PI / 180;
        const radius = Math.random() * 50 + 50;
        this.attr.position.setXYZ(
          i,
          Math.cos(radian) * radius,
          Math.sin(radian) * radius * 0.5 + 100,
          0
        );
        this.attr.valid.setX(i, 1);
      }
    }
    this.attr.position.needsUpdate = true;
  }
}
