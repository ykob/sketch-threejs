import PhysicsRenderer from '../../../modules/common/PhysicsRenderer';

const glslify = require('glslify');
const SIZE = 240;

export default class Butterfly {
  constructor(texture) {
    this.uniforms = {
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
    this.physicsRenderer = null;
    this.obj = this.createObj();
  }
  createObj() {
    const geometry = new THREE.PlaneBufferGeometry(SIZE, SIZE, 24, 24);
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
    mesh.rotation.set(-45 * Math.PI / 180, 0, 0);
    return mesh;
  }
  render(renderer, time) {
    this.uniforms.time.value += time;
  }
}
