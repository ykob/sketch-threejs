const THREE = require('three');
const { MathEx } = require('@ykob/js-util');
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
        value: h
      },
      addH2: {
        type: 'f',
        value: h - 0.5
      },
    };
    this.obj;
  }
  createObj() {
    // Define Geometry
    const simplex = new SimplexNoise(Math.random);
    const geometry = new THREE.OctahedronGeometry(50, 30);
    for (var i = 0; i < geometry.attributes.position.count; i++) {
      const v3 = new THREE.Vector3(
        geometry.attributes.position.getX(i),
        geometry.attributes.position.getY(i),
        geometry.attributes.position.getZ(i),
      );
      const noise1 = simplex.noise4D(
        v3.x / 72,
        v3.y / 64,
        v3.z / 72,
        1
      );
      const noise2 = simplex.noise4D(
        v3.x / 28,
        v3.y / 24,
        v3.z / 28,
        1
      );
      const noise3 = simplex.noise4D(
        v3.x / 4,
        v3.y / 4,
        v3.z / 4,
        1
      );
      const h =
        (MathEx.smoothstep(-0.05, 0.05, noise1 + noise2) * 2 - 1) *
        (
          2
          + MathEx.smoothstep(0.1, 0.2, Math.pow(noise1 + noise2 , 2)) * 2
          + MathEx.smoothstep(0.6, 0.7, Math.pow(noise1 + noise2 , 2)) * 6
          + noise3 * 0.2
        );
      v3.add(v3.clone().normalize().multiplyScalar(h));

      geometry.attributes.position.setXYZ(i, v3.x, v3.y, v3.z);
    }

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/land.vs').default,
      fragmentShader: require('./glsl/land.fs').default,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
