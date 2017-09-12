const glslify = require('glslify');
const SIZE = 280;
const TIME = 1;

export default class Butterfly {
  constructor(i, texture) {
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
      size: {
        type: 'f',
        value: SIZE
      },
      texture: {
        type: 't',
        value: texture
      },
      colorH: {
        type: 'f',
        value: 0.15
      },
    }
    this.obj = this.createObj();
    this.obj.renderOrder = 10;
    this.isTransform = false;
  }
  createObj() {
    const geometry = new THREE.PlaneBufferGeometry(SIZE, SIZE / 2, 64, 64);
    const sphereGeometry = new THREE.SphereBufferGeometry(SIZE * 0.1, 64, 64, -0.5 * Math.PI, 2 * Math.PI);
    const squareGeometry = new THREE.PlaneBufferGeometry(SIZE, SIZE * 0.5, 64, 64);
    geometry.addAttribute('spherePosition', sphereGeometry.attributes.position);
    geometry.addAttribute('squarePosition', squareGeometry.attributes.position);

    const mesh = new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/transform/butterfly.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/transform/butterfly.fs'),
        side: THREE.DoubleSide,
        transparent: true,
      })
    );
    mesh.position.y = SIZE * 0.3;
    return mesh;
  }
  render(renderer, time) {
    this.uniforms.time.value += time;
    if (this.uniforms.timeTransform.value < TIME && this.isTransform === true) {
      this.uniforms.timeTransform.value = Math.min(this.uniforms.timeTransform.value + time, TIME);
    } else if (this.uniforms.timeTransform.value > 0 && this.isTransform === false) {
      this.uniforms.timeTransform.value = Math.max(this.uniforms.timeTransform.value - time, 0);
    }
  }
}
