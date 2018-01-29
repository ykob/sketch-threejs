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
    const optTextGeometry = {
      font: font,
      size: 300,
      height: 0,
      curveSegments: 1,
    };
    const baseGeometries = [
      new THREE.TextBufferGeometry('HELLO', optTextGeometry),
      new THREE.TextBufferGeometry('WORLD', optTextGeometry),
    ];
    const geometry = new THREE.BufferGeometry();
    let maxCount = 0;

    baseGeometries.map((g, i) => {
      g.center();
      if (g.attributes.position.count > maxCount) {
        maxCount = g.attributes.position.count;
      }
    });
    baseGeometries.map((g, i) => {
      const index = (i > 0) ? i + 1 : '';
      if (g.attributes.position.count < maxCount) {
        const basePosition = g.attributes.position.array;
        const position = [];
        const opacity = [];
        for (var j = 0; j < maxCount * 3; j += 3) {
          if (j < (maxCount * 3 - basePosition.length) / 2) {
            position[j] = 0;
            position[j + 1] = 0;
            position[j + 2] = 0;
            opacity[j / 3] = 0;
          } else if (j >= basePosition.length + (maxCount * 3 - basePosition.length) / 2) {
            position[j] = 0;
            position[j + 1] = 0;
            position[j + 2] = 0;
            opacity[j / 3] = 0;
          } else {
            const k = j - (maxCount * 3 - basePosition.length) / 2;
            position[j] = g.attributes.position.array[k];
            position[j + 1] = g.attributes.position.array[k + 1];
            position[j + 2] = g.attributes.position.array[k + 2];
            opacity[j / 3] = 1;
          }
        }
        geometry.addAttribute(`position${index}`, new THREE.Float32BufferAttribute(position, 3, 1));
        geometry.addAttribute(`opacity${index}`, new THREE.Float32BufferAttribute(opacity, 1, 1));
      } else {
        const opacity = [];
        for (var j = 0; j < maxCount ; j++) {
          opacity[j] = 1;
        }
        geometry.addAttribute(`position${index}`, g.attributes.position);
        geometry.addAttribute(`opacity${index}`, new THREE.Float32BufferAttribute(opacity, 1, 1));
        geometry.addAttribute('normal', g.attributes.normal);
        geometry.addAttribute(`uv`, g.attributes.uv);
        geometry.setIndex(g.index);
      }
    });

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
