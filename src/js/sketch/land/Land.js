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
        value: h - 0.5
      },
      addH2: {
        type: 'f',
        value: h
      },
    };
    this.obj;
  }
  createObj() {
    // Define Geometry
    const baseY = 5;
    const simplex = new SimplexNoise(Math.random);
    const geometry = new THREE.BoxGeometry(100, baseY, 100, 60, 1, 60);
    for (var i = 0; i < geometry.attributes.position.count; i++) {
      const x = geometry.attributes.position.getX(i);
      const y = geometry.attributes.position.getY(i);
      const z = geometry.attributes.position.getZ(i);
      const noise1 = simplex.noise4D(
        x / 80,
        y / 80,
        z / 80,
        1
      );
      const noise2 = simplex.noise4D(
        x / 48,
        y / 32,
        z / 32,
        1
      );
      const noise3 = simplex.noise4D(
        x / 6,
        y / 6,
        z / 6,
        1
      );
      const noise4 = simplex.noise4D(
        x / 2,
        y / 2,
        z / 2,
        1
      );
      const step = (e, x) => {
        return (x >= e) ? 1 : 0;
      };
      const smoothstep = (e0, e1, x) => {
        if (e0 >= e1) return undefined;
        var t = MathEx.clamp((x - e0) / (e1 - e0), 0, 1);
        return t * t * (3 - 2 * t);
      };
      const updateY =
        (noise1 * 0.75 + 0.25) * 48
        + noise2 * 18
        + noise3 * 1.2
        + noise4 * 0.6;
      const s = smoothstep(0, 5, updateY);
      const isBottom = step(0, y);

      geometry.attributes.position.setY(i, (y + updateY * s) * isBottom);
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
