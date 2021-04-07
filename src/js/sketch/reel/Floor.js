const THREE = require('three');

export default class Floor {
  constructor() {
    this.mirrorCamera = new THREE.PerspectiveCamera(24, document.body.clientWidth / window.innerHeight, 1, 15000);
    this.mirrorRender = new THREE.WebGLRenderTarget(document.body.clientWidth, window.innerHeight);
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
      mirrorPosition: {
        type: 'v3',
        value: this.mirrorCamera.position
      }
    };
    this.mirrorCamera.up.set(0, -1, 0);
    this.obj = this.createObj();
  }
  createObj() {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(4000, 4000),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/floor.vs').default,
        fragmentShader: require('./glsl/floor.fs').default,
        transparent: true
      })
    )
  }
  updateTextureMatrix() {
    this.textureMatrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 1.0, 0.,
      0.0, 0.0, 0.0, 1.0
    );
    this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix);
    this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse);
  }
  render(renderer, scene, time) {
    this.uniforms.time.value += time;
    this.updateTextureMatrix();
    this.obj.visible = false;
    renderer.setRenderTarget(this.mirrorRender);
    renderer.render(scene, this.mirrorCamera);
    this.obj.visible = true;
  }
  resize() {
    this.mirrorCamera.aspect = document.body.clientWidth / window.innerHeight;
    this.mirrorCamera.updateProjectionMatrix();
    this.mirrorRender.setSize(document.body.clientWidth, window.innerHeight);
  }
}
