const glslify = require('glslify');
const SIZE = 240;

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
    }
    this.obj = this.createObj();
    this.obj.renderOrder = 10;
  }
  createObj() {
    const geometry = new THREE.PlaneBufferGeometry(SIZE, SIZE / 2, 24, 12);
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/butterfly/butterfly.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/butterfly/butterfly.fs'),
        depthWrite: false,
        side: THREE.DoubleSide,
        transparent: true
      })
    );
    mesh.position.y = SIZE * 0.55;
    mesh.rotation.set(-45 * Math.PI / 180, 0, 0);
    return mesh;
  }
  render(renderer, time) {
    this.uniforms.time.value += time;
    this.obj.position.z = (this.obj.position.z > -900) ? this.obj.position.z - 4 : 900;
  }
}
