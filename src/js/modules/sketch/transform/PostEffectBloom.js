const THREE = require('three/build/three.js');
const glslify = require('glslify');

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
    this.obj = null;

    this.createObj();
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/transform/postEffect.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/transform/postEffectBloom.fs'),
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.visible = false;
  }
  render(renderer, scene, camera, renderTarget) {
    this.obj.visible = true;
    renderer.render(scene, camera, renderTarget);
    this.obj.visible = false;
  }
}
