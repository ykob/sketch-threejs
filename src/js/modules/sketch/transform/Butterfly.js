const glslify = require('glslify');
const SIZE = 280;

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
        value: Math.random()
      },
    }
    this.obj = this.createObj();
    this.obj.renderOrder = 10;
  }
  createObj() {
    const geometry = new THREE.PlaneBufferGeometry(SIZE, SIZE / 2, 64, 64);
    const sphereGeometry = new THREE.SphereBufferGeometry(SIZE * 0.1, 64, 64, -0.5 * Math.PI, 2 * Math.PI);
    const squareGeometry = new THREE.PlaneBufferGeometry(SIZE * 0.75, SIZE * 0.75, 64, 64);
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
    mesh.position.y = SIZE * 0.25;
    mesh.rotation.set(-45 * Math.PI / 180, 0, 0);
    return mesh;
  }
  render(renderer, time) {
    this.uniforms.time.value += time;
    this.obj.position.y = SIZE * 0.25 + Math.sin(this.uniforms.time.value) * 15;
  }
}
