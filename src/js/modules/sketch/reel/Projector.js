export default class Projector extends THREE.PerspectiveCamera {
  constructor(fov, aspect, near, far) {
    super(fov, aspect, near, far);
    this.textureMatrix = new THREE.Matrix4();
    this.updateTextureMatrix();
  }
  updateTextureMatrix() {
    this.textureMatrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 1.0, 0.,
      0.0, 0.0, 0.0, 1.0
    );
    this.textureMatrix.multiply(this.projectionMatrix);
    this.textureMatrix.multiply(this.matrixWorldInverse);
  }
}
