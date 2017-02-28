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
    const geometry = new THREE.PlaneBufferGeometry(20, 20, 2, 2);
    const vertices = [];
    for (var i = 0; i < 2 * 3; i+= 3) {
      vertices[i + 0] = 0;
      vertices[i + 1] = 0;
      vertices[i + 2] = 0;
    }
    this.physicsRenderer = new PhysicsRenderer(
      glslify('../../../../glsl/sketch/butterfly/physicsRendererAcceleration.vs'),
      glslify('../../../../glsl/sketch/butterfly/physicsRendererAcceleration.fs'),
      glslify('../../../../glsl/sketch/butterfly/physicsRendererVelocity.vs'),
      glslify('../../../../glsl/sketch/butterfly/physicsRendererVelocity.fs')
    );
    this.physicsRenderer.init(renderer, vertices);
    this.physicsRenderer.mergeAUniforms({
      vTouchMove: {
        type: 'v2',
        value: this.vectorTouchMoveDiff
      }
    });
    this.uniforms.velocity.value = this.physicsRenderer.getCurrentVelocity();
    this.uniforms.acceleration.value = this.physicsRenderer.getCurrentAcceleration();
    geometry.addAttribute('uvVelocity', this.physicsRenderer.getBufferAttributeUv());
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
    this.physicsRenderer.render(renderer, time);
    this.uniforms.time.value += time;
  }
}
