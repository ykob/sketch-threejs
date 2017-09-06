const glslify = require('glslify');

export default class Floor {
  constructor(resolution) {
    this.mirrorCamera = new THREE.PerspectiveCamera(30, resolution.x / resolution.y, 1, 15000);
    this.mirrorRender = new THREE.WebGLRenderTarget(resolution.x, resolution.y);
    this.textureMatrix = new THREE.Matrix4();
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      texture: {
        type: 't',
        value: this.mirrorRender.texture
      },
      textureMatrix: {
        type: 'm4',
        value: this.textureMatrix
      },
    };
    this.mirrorCamera.up.set(0, -1, 0);
    this.obj = this.createObj();
  }
  createObj() {
    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1000, 2000),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/butterfly/floor.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/butterfly/floor.fs'),
        transparent: true
      })
    );
    mesh.rotation.set(-0.5 * Math.PI, 0, 0);
    return mesh;
  }
  updateTextureMatrix() {
    this.textureMatrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 1.0
    );
    this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix);
    this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse);
  }
  render(renderer, scene, time) {
    this.uniforms.time.value += time;
    this.updateTextureMatrix();
    this.obj.visible = false;
    renderer.render(scene, this.mirrorCamera, this.mirrorRender);
    this.obj.visible = true;
  }
  resize(resolution) {
    this.mirrorCamera.aspect = resolution.x / resolution.y;
    this.mirrorCamera.updateProjectionMatrix();
    this.mirrorRender.setSize(resolution.x, resolution.y);
  }
}
