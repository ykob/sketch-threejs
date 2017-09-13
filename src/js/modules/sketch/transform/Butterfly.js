const glslify = require('glslify');

export default class Butterfly {
  constructor(i, texture) {
    this.size = 280;
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
        value: this.size
      },
      texture: {
        type: 't',
        value: texture
      },
      colorH: {
        type: 'f',
        value: 0.08
      },
    }
    this.obj = this.createObj();
    this.obj.renderOrder = 10;
    this.isTransform = false;
  }
  createObj() {
    const geometry = new THREE.PlaneBufferGeometry(this.size, this.size / 2, 64, 64);
    const sphereGeometry = new THREE.SphereBufferGeometry(this.size * 0.1, 64, 64, -0.5 * Math.PI, 2 * Math.PI);
    const squareGeometry = new THREE.PlaneBufferGeometry(this.size, this.size * 0.5, 64, 64);
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
    mesh.position.y = this.size * 0.3;
    return mesh;
  }
  render(renderer, time) {
    this.uniforms.time.value += time;
    if (this.uniforms.timeTransform.value < 1 && this.isTransform === true) {
      this.uniforms.timeTransform.value = Math.min(this.uniforms.timeTransform.value + time, 1);
    } else if (this.uniforms.timeTransform.value > 0 && this.isTransform === false) {
      this.uniforms.timeTransform.value = Math.max(this.uniforms.timeTransform.value - time, 0);
    }
  }
}
