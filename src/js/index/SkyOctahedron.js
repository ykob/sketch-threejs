const THREE = require('three');

const computeFaceNormal = (v0, v1, v2) => {
  const n = [];
  const v1a = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
  const v2a = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
  n[0] = v1a[1] * v2a[2] - v1a[2] * v2a[1];
  n[1] = v1a[2] * v2a[0] - v1a[0] * v2a[2];
  n[2] = v1a[0] * v2a[1] - v1a[1] * v2a[0];
  const l = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2], 2);
  for (var i = 0; i < n.length; i++) {
    n[i] = n[i] / l;
  }
  return n;
};

export default class SkyOctahedron {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
    };
    this.obj = this.createObj();
  }
  createObj() {
    const geometry = new THREE.OctahedronGeometry(90, 20);
    const positions = geometry.attributes.position.array;
    const faceNormalsBase = [];
    const centersBase = [];
    const delaysBase = [];
    for (var i = 0; i < positions.length; i += 9) {
      const n = computeFaceNormal(
        [positions[i + 0], positions[i + 1], positions[i + 2]],
        [positions[i + 3], positions[i + 4], positions[i + 5]],
        [positions[i + 6], positions[i + 7], positions[i + 8]]
      );
      faceNormalsBase.push(n[0], n[1], n[2], n[0], n[1], n[2], n[0], n[1], n[2]);
      const c = [
        (positions[i + 0] + positions[i + 3] + positions[i + 6]) / 3,
        (positions[i + 1] + positions[i + 4] + positions[i + 7]) / 3,
        (positions[i + 2] + positions[i + 5] + positions[i + 8]) / 3
      ];
      const delay = Math.random() * 0.5;
      centersBase.push(c[0], c[1], c[2], c[0], c[1], c[2], c[0], c[1], c[2]);
      delaysBase.push(delay, delay, delay);
    }
    const faceNormals = new Float32Array(faceNormalsBase);
    const centers = new Float32Array(centersBase);
    const delays = new Float32Array(delaysBase);
    geometry.setAttribute('faceNormal', new THREE.BufferAttribute(faceNormals, 3))
    geometry.setAttribute('center', new THREE.BufferAttribute(centers, 3))
    geometry.setAttribute('delay', new THREE.BufferAttribute(delays, 1))
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/skyOctahedron.vs').default,
        fragmentShader: require('./glsl/skyOctahedron.fs').default,
        transparent: true,
        side: THREE.DoubleSide
      })
    )
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
