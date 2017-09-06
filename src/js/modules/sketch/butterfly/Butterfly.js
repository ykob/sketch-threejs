import PhysicsRenderer from '../../../modules/common/PhysicsRenderer';

const glslify = require('glslify');
const SIZE = 200;

export default class Butterfly {
  constructor() {
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
        value: null
      },
    }
    this.physicsRenderer = null;
    this.obj = null;
  }
  loadTexture(images, renderer, callback) {
    const loader = new THREE.TextureLoader();
    loader.load(images, (texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      this.uniforms.texture.value = texture;
      this.obj = this.createObj(renderer);
      callback();
    });
  }
  createObj(renderer) {
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
