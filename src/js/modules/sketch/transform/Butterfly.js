const THREE = require('three/build/three.js');
const glslify = require('glslify');

export default class Butterfly {
  constructor(i, tex1, tex2) {
    this.size = 280;
    this.interval = 1.2;
    this.uniforms = {
      index: {
        type: 'f',
        value: i
      },
      time: {
        type: 'f',
        value: 0
      },
      timeTransform: {
        type: 'f',
        value: 0
      },
      interval: {
        type: 'f',
        value: this.interval
      },
      size: {
        type: 'f',
        value: this.size
      },
      texButterfly: {
        type: 't',
        value: tex1
      },
      texPicture: {
        type: 't',
        value: tex2
      },
      colorH: {
        type: 'f',
        value: 0.08
      },
    }
    this.obj = null;
    this.isTransform = false;

    this.createObj();
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(this.size, this.size / 2, 64, 32);
    const sphereGeometry = new THREE.SphereBufferGeometry(this.size * 0.1, 64, 32, -0.5 * Math.PI, 2 * Math.PI);
    const squareGeometry = new THREE.PlaneBufferGeometry(this.size * 1.1, this.size * 0.55, 64, 32);

    // Add common attributes
    geometry.addAttribute('spherePosition', sphereGeometry.attributes.position);
    geometry.addAttribute('squarePosition', squareGeometry.attributes.position);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/transform/butterfly.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/transform/butterfly.fs'),
      side: THREE.DoubleSide,
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.position.y = this.size * 0.3;
    this.obj.renderOrder = 10;
  }
  render(renderer, time) {
    this.uniforms.time.value += time;
    if (this.uniforms.timeTransform.value < this.interval && this.isTransform === true) {
      this.uniforms.timeTransform.value = Math.min(this.uniforms.timeTransform.value + time, this.interval);
    } else if (this.uniforms.timeTransform.value > 0 && this.isTransform === false) {
      this.uniforms.timeTransform.value = Math.max(this.uniforms.timeTransform.value - time, 0);
    }
  }
}
