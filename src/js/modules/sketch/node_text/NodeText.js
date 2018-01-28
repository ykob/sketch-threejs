const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class Node {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj = null;
    this.objWire = null;
    this.objPoints = null;
  }
  createObj(font) {
    // Define Geometry
    const geometry = new THREE.TextBufferGeometry('HELLO', {
      font: font,
      size: 300,
      height: 0,
      curveSegments: 1,
    });
    geometry.center();

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/node_text/nodeText.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/node_text/nodeText.fs'),
      depthWrite: false,
      transparent: true,
      flatShading: true,
    });
    const materialWire = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/node_text/nodeText.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/node_text/nodeTextWire.fs'),
      depthWrite: false,
      transparent: true,
      wireframe: true,
    });
    const materialPoints = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/node_text/nodeTextPoints.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/node_text/nodeTextPoints.fs'),
      depthWrite: false,
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.objWire = new THREE.Mesh(geometry, materialWire);
    this.objPoints = new THREE.Points(geometry, materialPoints);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
