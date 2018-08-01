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
    const baseY = 40;
    const simplex = new SimplexNoise(Math.random);
    const geometry = new THREE.BoxBufferGeometry(300, baseY, 300, 60, 1, 60);
    for (var i = 0; i < geometry.attributes.position.count; i++) {
      const x = geometry.attributes.position.getX(i);
      const y = geometry.attributes.position.getY(i);
      const z = geometry.attributes.position.getZ(i);
      const noise1 = simplex.noise4D(
        x / 180,
        y / 180,
        z / 180,
        1
      );
      const noise2 = simplex.noise4D(
        x / 60,
        y / 60,
        z / 60,
        1
      );
      const noise3 = simplex.noise4D(
        x / 20,
        y / 20,
        z / 20,
        1
      );
      const noise4 = simplex.noise4D(
        x / 120,
        y / 90,
        z / 90,
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
        (noise1 * 0.75 + 0.25) * 180
        + noise2 * 20
        + noise3 * 7
        + noise4 * 40;
      const s = smoothstep(0, 30, updateY);
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
