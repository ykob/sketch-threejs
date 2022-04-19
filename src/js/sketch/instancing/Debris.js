const THREE = require('three');
const { MathEx } = require('@ykob/js-util');

export default class Debris {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      cubeTex: {
        type: 't',
        value: null
      }
    };
    this.instances = 1000;
    this.obj;
  }
  init(texture) {
    this.uniforms.cubeTex.value = texture;
    this.obj = this.createObj();
  }
  createObj() {
    // Define Geometry
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxGeometry(10, 10, 10);

    // Add common attributes
    geometry.copy(baseGeometry);

    // Add common attributes
    const translate = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3);
    const offsets = new THREE.InstancedBufferAttribute(new Float32Array(this.instances), 1);
    const rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.instances * 3), 3);
    for ( var i = 0, ul = offsets.count; i < ul; i++ ) {
      const position = MathEx.spherical(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 3000 + 100);
      translate.setXYZ(i, position[0], position[1], position[2]);
      offsets.setXYZ(i, Math.random() * 100);
      rotates.setXYZ(i, Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    }
    geometry.setAttribute('translate', translate);
    geometry.setAttribute('offset', offsets);
    geometry.setAttribute('rotate', rotates);

    // Create Object3D
    return new THREE.InstancedMesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/debris.vs').default,
        fragmentShader: require('./glsl/debris.fs').default,
        transparent: true,
        side: THREE.DoubleSide
      }),
      this.instances
    )
  }
  render(time) {
    this.uniforms.time.value += time;
    if (this.obj) {
      this.obj.instanceMatrix.needsUpdate = true;
    }
  }
}
