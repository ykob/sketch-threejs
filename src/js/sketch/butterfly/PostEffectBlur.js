const THREE = require('three');

export default class PostEffectBlur {
  constructor(texture, x, y, radius) {
    this.uniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(),
      },
      direction: {
        type: 'v2',
        value: new THREE.Vector2(x, y)
      },
      radius: {
        type: 'f',
        value: radius
      },
      texture: {
        type: 't',
        value: texture
      }
    };
    this.obj = this.createObj();
    this.obj.visible = false;
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/postEffect.vs').default,
        fragmentShader: require('./glsl/postEffectBlur.fs').default,
      })
    );
  }
  resize(resolution) {
    this.uniforms.resolution.value.set(resolution.x, resolution.y);
  }
  render(renderer, scene, camera, renderTarget = null) {
    this.obj.visible = true;
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    this.obj.visible = false;
  }
}
