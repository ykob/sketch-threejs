import PhysicsRenderer from '../../../modules/common/PhysicsRenderer';

const glslify = require('glslify');

export default class Butterfly {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      texture: {
        type: 't',
        value: null
      },
      velocity: {
        type: 't',
        value: null
      },
      acceleration: {
        type: 't',
        value: null
      }
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
    const geometry = new THREE.PlaneBufferGeometry(100, 100, 8, 8);
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/butterfly/butterfly.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/butterfly/butterfly.fs'),
        side: THREE.DoubleSide,
        transparent: true
      })
    );
  }
  render(renderer, time) {
    this.uniforms.time.value += time;
  }
}
