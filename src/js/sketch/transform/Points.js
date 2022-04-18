const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class Points {
  constructor(size) {
    this.interval = 4;
    this.attr = {
      position: new THREE.BufferAttribute(new Float32Array(size * 3), 3),
      colorH: new THREE.BufferAttribute(new Float32Array(size), 1),
      index: new THREE.BufferAttribute(new Float32Array(size), 1),
      opacity: new THREE.BufferAttribute(new Float32Array(size), 1),
      valid: new THREE.BufferAttribute(new Float32Array(size), 1),
    };
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
    this.obj;

    this.createObj();
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.BufferGeometry();

    // Add attributes
    const indices = [];
    for (var i = 0; i < this.uniforms.size.value; i++) {
      this.attr.index.setX(i, i);
    }
    geometry.setAttribute('position', this.attr.position);
    geometry.setAttribute('colorH', this.attr.colorH);
    geometry.setAttribute('i', this.attr.index);
    geometry.setAttribute('opacity', this.attr.opacity);
    geometry.setAttribute('valid', this.attr.valid);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/points.vs').default,
      fragmentShader: require('./glsl/points.fs').default,
      depthWrite: false,
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Points(geometry, material);
    this.obj.renderOrder = 20;
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
        const radian1 = (Math.random() * -90 - 90) * Math.PI / 180;
        const radian2 = (Math.random() * -180) * Math.PI / 180;
        const radius = Math.random() * butterfly.uniforms.size.value / 4 + butterfly.uniforms.size.value / 8;
        const position = MathEx.spherical(radian1, radian2, radius);
        const opacity = (butterfly.uniforms.timeTransform.value > 0) ? 0 : 1;

        this.attr.position.setXYZ(
          i,
          position[0] + butterfly.obj.position.x,
          position[1] * 0.2 + butterfly.obj.position.y + Math.sin(butterfly.uniforms.time.value) * 20.0,
          position[2] * 0.5 + butterfly.obj.position.z
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
