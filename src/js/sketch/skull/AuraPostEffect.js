const THREE = require('three');

import vs from './glsl/AuraPostEffect.vs';
import fs from './glsl/AuraPostEffect.fs';

export default class AuraPostEffect extends THREE.Mesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: {
        resolution: {
          type: 'v2',
          value: new THREE.Vector2(512, 512),
        },
        direction: {
          type: 'v2',
          value: new THREE.Vector2(0, 0)
        },
        radius: {
          type: 'f',
          value: 1
        },
        texture: {
          type: 't',
          value: null
        }
      },
      vertexShader: vs,
      fragmentShader: fs,
    });

    // Create Object3D
    super(geometry, material);
    this.name = 'AuraPostEffect';
  }
  setDirection(x, y) {
    this.material.uniforms.direction.value.set(x, y);
  }
  setTexture(texture) {
    this.material.uniforms.texture.value = texture;
  }
  update(renderer, scene, camera, renderTarget = null) {
    this.obj.visible = true;
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    this.obj.visible = false;
  }
}
