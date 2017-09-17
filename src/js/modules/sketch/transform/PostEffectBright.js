const glslify = require('glslify');

export default class PostEffectBright {
  constructor(brightMin, texture) {
    this.uniforms = {
      brightMin: {
        type: 'f',
        value: brightMin,
      },
      texture: {
        type: 't',
        value: texture,
      }
    };
    this.obj = this.createObj();
    this.obj.visible = false;
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/transform/postEffect.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/transform/postEffectBright.fs'),
      })
    );
  }
  render(renderer, scene, camera, renderTarget) {
    this.obj.visible = true;
    renderer.render(scene, camera, renderTarget);
    this.obj.visible = false;
  }
}
