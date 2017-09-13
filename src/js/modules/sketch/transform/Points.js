const glslify = require('glslify');

export default class Points {
  constructor(size) {
    this.interval = 6;
    this.attr = {
      position: new THREE.BufferAttribute(new Float32Array(size * 3), 3),
      colorH: new THREE.BufferAttribute(new Float32Array(size), 1),
      index: new THREE.BufferAttribute(new Float32Array(size), 1),
      opacity: new THREE.BufferAttribute(new Float32Array(size), 1),
      valid: new THREE.BufferAttribute(new Float32Array(size), 1),
    };
    this.geometry = new THREE.BufferGeometry();
    this.uniforms = {
      size: {
        type: 'f',
        value: size
      },
      interval: {
        type: 'f',
        value: this.interval
      },
      time: {
        type: 'f',
        value: 0
      },
    };
    this.butterflies = null;
    this.butterfliesLengh = 0;
    this.obj = this.createObj();
    this.obj.renderOrder = 20;
  }
  createObj() {
    const indices = [];
    for (var i = 0; i < this.uniforms.size.value; i++) {
      this.attr.index.setX(i, i);
    }
    this.geometry.addAttribute('position', this.attr.position);
    this.geometry.addAttribute('colorH', this.attr.colorH);
    this.geometry.addAttribute('i', this.attr.index);
    this.geometry.addAttribute('opacity', this.attr.opacity);
    this.geometry.addAttribute('valid', this.attr.valid);

    return new THREE.Points(
      this.geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/transform/points.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/transform/points.fs'),
        depthWrite: false,
        transparent: true,
      })
    );
  }
  addButterflies(butterflies) {
    this.butterflies = butterflies;
    this.butterfliesLengh = butterflies.length;
  }
  render(time) {
    this.uniforms.time.value += time;
    for (var i = 0; i < this.uniforms.size.value; i++) {
      const time = (this.uniforms.time.value + this.attr.index.getX(i)
        / this.uniforms.size.value * this.interval) % this.interval;
      const isValid = this.attr.valid.getX(i);

      if (time >= this.interval * 0.9 && isValid == 1) {
        this.attr.valid.setX(i, 0);
      } else if (time <= this.interval * 0.9 && isValid == 0) {
        const index = Math.floor(Math.random() * this.butterfliesLengh);
        const butterfly = this.butterflies[index];
        const radian = (Math.random() * -180) * Math.PI / 180;
        const radius = Math.random() * 80;
        const opacity = (butterfly.uniforms.timeTransform.value > 0) ? 0 : 1;

        this.attr.position.setXYZ(
          i,
          Math.cos(radian) * radius + butterfly.obj.position.x,
          Math.sin(radian) * radius * 0.5 + butterfly.obj.position.y + Math.sin(butterfly.uniforms.time.value) * 20.0,
          butterfly.obj.position.z
        );
        this.attr.colorH.setX(i, butterfly.uniforms.colorH.value);
        this.attr.opacity.setX(i, opacity);
        this.attr.valid.setX(i, 1);
      }
    }
    this.attr.position.needsUpdate = true;
    this.attr.colorH.needsUpdate = true;
    this.attr.opacity.needsUpdate = true;
    this.attr.valid.needsUpdate = true;
  }
}
