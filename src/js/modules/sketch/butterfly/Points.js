const glslify = require('glslify');
const SIZE = 12 * 50;
const INTERVAL = 3;

export default class Points {
  constructor() {
    this.attr = {
      position: new THREE.BufferAttribute(new Float32Array(SIZE * 3), 3),
      colorH: new THREE.BufferAttribute(new Float32Array(SIZE), 1),
      index: new THREE.BufferAttribute(new Float32Array(SIZE), 1),
      valid: new THREE.BufferAttribute(new Float32Array(SIZE), 1),
    };
    this.geometry = new THREE.BufferGeometry();
    this.uniforms = {
      size: {
        type: 'f',
        value: SIZE
      },
      interval: {
        type: 'f',
        value: INTERVAL
      },
      time: {
        type: 'f',
        value: 0
      },
    };
    this.butterflies = null;
    this.butterfliesLengh = 0;
    this.obj = this.createObj();
    this.obj.renderOrder = 5;
  }
  createObj() {
    const indices = [];
    for (var i = 0; i < SIZE; i++) {
      this.attr.index.setX(i, i);
    }
    this.geometry.addAttribute('position', this.attr.position);
    this.geometry.addAttribute('colorH', this.attr.colorH);
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
  addButterflies(butterflies) {
    this.butterflies = butterflies;
    this.butterfliesLengh = butterflies.length;
  }
  render(time) {
    this.uniforms.time.value += time;
    for (var i = 0; i < SIZE; i++) {
      const time = (this.uniforms.time.value + this.attr.index.getX(i) / SIZE * INTERVAL) % INTERVAL;
      const isValid = this.attr.valid.getX(i);

      if (time >= INTERVAL * 0.9 && isValid == 1) {
        this.attr.valid.setX(i, 0);
      } else if (time <= INTERVAL * 0.9 && isValid == 0) {
        const index = Math.floor(Math.random() * this.butterfliesLengh);
        const butterfly = this.butterflies[index];
        const radian = Math.random() * 360 * Math.PI / 180;
        const radius = Math.random() * 25 + 75;
        this.attr.position.setXYZ(
          i,
          Math.cos(radian) * radius + butterfly.obj.position.x,
          Math.sin(radian) * radius * 0.25 + butterfly.obj.position.y,
          butterfly.obj.position.z
        );
        this.attr.colorH.setX(i, butterfly.uniforms.colorH.value);
        this.attr.valid.setX(i, 1);
      }
    }
    this.attr.position.needsUpdate = true;
    this.attr.colorH.needsUpdate = true;
  }
}
