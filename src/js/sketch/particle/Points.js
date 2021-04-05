const THREE = require('three');

const PhysicsRenderer = require('../../common/PhysicsRenderer').default;

export default class Points {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      velocity: {
        type: 't',
        value: null
      },
      acceleration: {
        type: 't',
        value: null
      }
    };
    this.physicsRenderer = null;
    this.vectorTouchMove = new THREE.Vector2(0, 0);
    this.vectorTouchMoveDiff = new THREE.Vector2(0, 0);
    this.obj;
  }
  init(renderer) {
    this.obj = this.createObj(renderer);
  }
  createObj(renderer) {
    const detail = (window.innerWidth > 768) ? 200 : 150;
    const geometry = new THREE.OctahedronGeometry(100, detail);
    const verticesBase = geometry.attributes.position.array;
    const vertices = [];
    for (var i = 0; i < verticesBase.length; i+= 3) {
      vertices[i + 0] = verticesBase[i + 0] + (Math.random() * 2 - 1) * 10;
      vertices[i + 1] = verticesBase[i + 1] + (Math.random() * 2 - 1) * 10;
      vertices[i + 2] = verticesBase[i + 2] + (Math.random() * 2 - 1) * 10;
    }
    this.physicsRenderer = new PhysicsRenderer(
      require('./glsl/physicsRendererAcceleration.vs').default,
      require('./glsl/physicsRendererAcceleration.fs').default,
      require('./glsl/physicsRendererVelocity.vs').default,
      require('./glsl/physicsRendererVelocity.fs').default,
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
    geometry.setAttribute('uvVelocity', this.physicsRenderer.getBufferAttributeUv());
    return new THREE.Points(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/points.vs').default,
        fragmentShader: require('./glsl/points.fs').default,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  }
  render(renderer, time) {
    this.physicsRenderer.render(renderer, time);
    this.uniforms.time.value += time;
  }
  touchStart(v) {
    this.vectorTouchMove.copy(v);
  }
  touchMove(v) {
    this.vectorTouchMoveDiff.set(
      v.x - this.vectorTouchMove.x,
      v.y - this.vectorTouchMove.y
    );
    this.vectorTouchMove.copy(v);
  }
  touchEnd() {
    this.vectorTouchMove.set(0, 0);
    this.vectorTouchMoveDiff.set(0, 0);
  }
  resize() {
    if (this.physicsRenderer) {
      this.physicsRenderer.resize();
    }
  }
}
