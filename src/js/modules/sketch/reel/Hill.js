const glslify = require('glslify');

export default class Hill {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      }
    };
    this.instances = 3;
    this.obj = this.createObj();
    this.obj.rotation.set(0, 0.3 * Math.PI, 0);
  }
  createObj() {
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.BoxBufferGeometry(150, 1, 10);
    geometry.addAttribute('position', baseGeometry.attributes.position);
    geometry.addAttribute('normal', baseGeometry.attributes.normal);
    geometry.setIndex(baseGeometry.index);
    const height = new THREE.InstancedBufferAttribute(
      new Float32Array(this.instances), 1, 1
    );
    const offsetX = new THREE.InstancedBufferAttribute(
      new Float32Array(this.instances), 1, 1
    );
    for ( var i = 0, ul = this.instances; i < ul; i++ ) {
      height.setXYZ(i, (i + 1) * 100 + 250);
      offsetX.setXYZ(i, (i - 1) * 200);
    }
    geometry.addAttribute('height', height);
    geometry.addAttribute('offsetX', offsetX);
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/reel/hill.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/reel/hill.fs'),
        shading: THREE.FlatShading
      })
    )
  }
}
