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
  createObj() {
    // Define Geometry
    const geometry = new THREE.RingBufferGeometry();

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/node_text/node.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/node_text/node.fs'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      flatShading: true,
    });
    const materialWire = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/node_text/node.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/node_text/nodeWire.fs'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      wireframe: true,
    });
    const materialPoints = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/node_text/nodePoints.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/node_text/nodePoints.fs'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
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
