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
    const geometry = new THREE.RingBufferGeometry(1550, 1600, 36, 2, MathEx.radians(135), MathEx.radians(270));

    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/cyberspace/node.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/cyberspace/node.fs'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      flatShading: true,
    });
    const materialWire = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/cyberspace/node.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/cyberspace/nodeWire.fs'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
      wireframe: true,
    });
    const materialPoints = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/cyberspace/nodePoints.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/cyberspace/nodePoints.fs'),
      depthWrite: false,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

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
