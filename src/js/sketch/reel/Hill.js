const THREE = require('three');

export default class Hill {
  constructor() {
    var cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128);
    this.cubeCamera = new THREE.CubeCamera(1, 15000, cubeRenderTarget);
    this.instances = 6;
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    };
    this.obj = this.createObj();
    this.obj.rotation.set(0, 0.3 * Math.PI, 0);
  }
  createObj() {
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxGeometry(40, 1, 10);
    geometry.copy(baseGeometry);

    const height = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1);
    const offsetX = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1);
    for ( var i = 0, ul = this.instances; i < ul; i++ ) {
      height.setXYZ(i, (i + 1) * 150 + 200);
      offsetX.setXYZ(i, (i - (this.instances - 1) / 2) * 120);
    }
    geometry.setAttribute('height', height);
    geometry.setAttribute('offsetX', offsetX);
    return new THREE.InstancedMesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/hill.vs').default,
        fragmentShader: require('./glsl/hill.fs').default,
      }),
      this.instances
    )
  }
  render(renderer, scene, time) {
    this.uniforms.time.value += time;
    this.obj.visible = false;
    this.cubeCamera.update(renderer, scene);
    this.obj.visible = true;
  }
}
