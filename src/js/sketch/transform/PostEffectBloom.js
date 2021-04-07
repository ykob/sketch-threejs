const THREE = require('three');

export default class PostEffectBloom {
  constructor(brightMin, texture1, texture2) {
    this.uniforms = {
      brightMin: {
        type: 'f',
        value: brightMin,
      },
      texture1: {
        type: 't',
        value: texture1
      },
      texture2: {
        type: 't',
        value: texture2
      }
    };
    this.obj;

    this.createObj();
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/postEffect.vs').default,
      fragmentShader: require('./glsl/postEffectBloom.fs').default,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.visible = false;
  }
  render(renderer, scene, camera, renderTarget = null) {
    this.obj.visible = true;
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    this.obj.visible = false;
  }
}
