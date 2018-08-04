const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');
const SimplexNoise = require('../../vendor/simplex-noise');

export default class Land {
  constructor(h) {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      addH1: {
        type: 'f',
        value: h - 0.5
      },
      addH2: {
        type: 'f',
        value: h
      },
    };
    this.obj = null;
  }
  createObj() {
    // Define Geometry
    const simplex = new SimplexNoise(Math.random);
    const geometry = new THREE.OctahedronBufferGeometry(45, 5);
    for (var i = 0; i < geometry.attributes.position.count; i++) {
      const v3 = new THREE.Vector3(
        geometry.attributes.position.getX(i),
        geometry.attributes.position.getY(i),
        geometry.attributes.position.getZ(i),
      );
      const noise1 = simplex.noise4D(
        v3.x / 120,
        v3.y / 120,
        v3.z / 120,
        1
      );
      const noise2 = simplex.noise4D(
        v3.x / 48,
        v3.y / 48,
        v3.z / 48,
        1
      );
      const noise3 = simplex.noise4D(
        v3.x / 6,
        v3.y / 6,
        v3.z / 6,
        1
      );
      const noise4 = simplex.noise4D(
        v3.x / 2,
        v3.y / 2,
        v3.z / 2,
        1
      );
      const h =
        (noise1 * 0.75 + 0.25) * 10
        + noise2 * 15
        + noise3 * 1.5
        + noise4 * 0.6;
      v3.add(v3.clone().normalize().multiplyScalar(h));

      geometry.attributes.position.setXYZ(i, v3.x, v3.y, v3.z);
    }

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('../../../../glsl/sketch/planet/land.vs'),
      fragmentShader: glslify('../../../../glsl/sketch/planet/land.fs'),
      flatShading: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
