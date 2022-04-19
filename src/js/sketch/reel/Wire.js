const THREE = require('three');

const { MathEx } = require('@ykob/js-util');

export default class Wire {
  constructor(instances) {
    this.size = 120;
    this.baseGeometry = new THREE.BoxGeometry(
      this.size, this.size, this.size
    );
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      rotate: {
        type: 'f',
        value: 0
      },
      pickedId: {
        type: 'f',
        value: -1
      }
    }
    this.instances = instances;
    this.obj = this.createObj();
    this.objPicked = this.createObjPicked();
  }
  createObj() {
    const geometry = new THREE.InstancedBufferGeometry();

    // Setting BufferAttribute
    geometry.copy(this.baseGeometry);

    // Setting InstancedBufferAttribute
    const radian = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1);
    const hsv = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3);
    const timeHover = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1);
    for (var i = 0; i < this.instances; i++) {
      radian.setXYZ(i, MathEx.radians(i / this.instances * 360));
      hsv.setXYZ(i, i / this.instances - 0.25, 0.2, 1.0);
      timeHover.setXYZ(i, 0);
    }
    geometry.setAttribute('radian', radian);
    geometry.setAttribute('hsv', hsv);
    geometry.setAttribute('timeHover', timeHover);

    return new THREE.InstancedMesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/wire.vs').default,
        fragmentShader: require('./glsl/wire.fs').default,
        depthWrite: false,
        transparent: true,
        side: THREE.DoubleSide,
      }),
      this.instances
    );
  }
  createObjPicked() {
    const geometry = new THREE.InstancedBufferGeometry();

    // Setting BufferAttribute
    geometry.copy(this.baseGeometry);

    // Setting InstancedBufferAttribute
    const radian = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1);
    const pickedColor = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3);
    const color = new THREE.Color();
    const timeHover = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1);
    for (var i = 0; i < this.instances; i++) {
      radian.setXYZ(i, MathEx.radians(i / this.instances * 360));
      color.setHex(i);
      pickedColor.setXYZ(i, color.r, color.g, color.b);
      timeHover.setXYZ(i, 0);
    }
    geometry.setAttribute('radian', radian);
    geometry.setAttribute('pickedColor', pickedColor);
    geometry.setAttribute('timeHover', timeHover);

    return new THREE.InstancedMesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/wirePicked.vs').default,
        fragmentShader: require('./glsl/wirePicked.fs').default,
      }),
      this.instances
    );
  }
  render(time) {
    const timeHoverAttribute = this.obj.geometry.attributes.timeHover;
    const timeHoverAttributePicked = this.objPicked.geometry.attributes.timeHover;
    this.uniforms.time.value += time;
    for (var i = 0; i < timeHoverAttribute.array.length; i++) {
      if (this.uniforms.pickedId.value == i) {
        timeHoverAttribute.array[i] = Math.min(timeHoverAttribute.array[i] + time, 0.3);
        timeHoverAttributePicked.array[i] = Math.min(timeHoverAttributePicked.array[i] + time, 0.3);
      } else {
        timeHoverAttribute.array[i] = Math.max(timeHoverAttribute.array[i] - time, 0);
        timeHoverAttributePicked.array[i] = Math.max(timeHoverAttributePicked.array[i] - time, 0);
      }
    }
    timeHoverAttribute.needsUpdate = true;
    timeHoverAttributePicked.needsUpdate = true;
  }
}
