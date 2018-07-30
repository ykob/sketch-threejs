const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');
const SimplexNoise = require('../../vendor/simplex-noise');

export default class Mesh {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj = null;
  }
  createObj() {
    // Define Geometry
    const baseY = 200;
    const simplex = new SimplexNoise(Math.random);
    const geometry = new THREE.BoxBufferGeometry(2000, baseY, 2000, 50, 1, 50);
    for (var i = 0; i < geometry.attributes.position.count; i++) {
      const x = geometry.attributes.position.getX(i);
      const y = geometry.attributes.position.getY(i);
      const z = geometry.attributes.position.getZ(i);
      const noise1 = simplex.noise4D(
        x / 1600,
        y / 1600,
        z / 1600,
        1
      );
      const noise2 = simplex.noise4D(
        x / 400,
        y / 400,
        z / 400,
        1
      );
      const noise3 = simplex.noise4D(
        x / 100,
        y / 100,
        z / 100,
        1
      );
      const updateY = Math.max(
        0,
        noise1 * 800
        + noise2 * 200
        + noise3 / 2 * 20
      );
      const isEnabled = (y / baseY + 0.5);

      geometry.attributes.position.setY(i, (y + updateY) * isEnabled);
    }

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/land/land.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/land/land.fs'),
      flatShading: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
