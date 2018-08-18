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
    const geometry = new THREE.RingBufferGeometry(1550, 1600, 36, 2, MathEx.radians(135), MathEx.radians(270));

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/node.vs'),
      fragmentShader: glslify('./glsl/node.fs'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      flatShading: true,
    });
    const materialWire = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/node.vs'),
      fragmentShader: glslify('./glsl/nodeWire.fs'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      wireframe: true,
    });
    const materialPoints = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/nodePoints.vs'),
      fragmentShader: glslify('./glsl/nodePoints.fs'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.objWire = new THREE.Mesh(geometry, materialWire);
    this.objPoints = new THREE.Points(geometry, materialPoints);

    this.obj.position.set(0, 0, -1200);
    this.objWire.position.set(0, 0, -1200);
    this.objPoints.position.set(0, 0, -1200);
  }
  render(time) {
    this.uniforms.time.value += time;
    const rotation = [
      MathEx.radians(Math.sin(this.uniforms.time.value * 0.1) * 20 + 90),
      MathEx.radians(Math.sin(this.uniforms.time.value * 0.05) * 20),
      0,
    ]
    this.obj.rotation.set(rotation[0], rotation[1], rotation[2]);
    this.objWire.rotation.set(rotation[0], rotation[1], rotation[2]);
    this.objPoints.rotation.set(rotation[0], rotation[1], rotation[2]);
  }
}
