const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');
const SimplexNoise = require('../../vendor/simplex-noise');

export default class Land {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      addH1: {
        type: 'f',
        value: Math.random()
      },
      addH2: {
        type: 'f',
        value: Math.random()
      },
    };
    this.obj = null;
  }
  createObj() {
    // Define Geometry
    const baseY = 40;
    const simplex = new SimplexNoise(Math.random);
    const geometry = new THREE.BoxBufferGeometry(500, baseY, 500, 60, 1, 60);
    for (var i = 0; i < geometry.attributes.position.count; i++) {
      const x = geometry.attributes.position.getX(i);
      const y = geometry.attributes.position.getY(i);
      const z = geometry.attributes.position.getZ(i);
      const noise1 = simplex.noise4D(
        x / 500,
        y / 500,
        z / 500,
        1
      );
      const noise2 = simplex.noise4D(
        x / 100,
        y / 100,
        z / 100,
        1
      );
      const noise3 = simplex.noise4D(
        x / 20,
        y / 20,
        z / 20,
        1
      );
      const noise4 = simplex.noise4D(
        x / 400,
        y / 60,
        z / 60,
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
        (noise1 * 0.75 + 0.25) * 350
        + noise2 * 40
        + noise3 * 5
        + noise4 * 20;
      const s = smoothstep(0, 100, updateY);
      const isBottom = step(0, y);

      geometry.attributes.position.setY(i, (y + updateY * s) * isBottom);
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
