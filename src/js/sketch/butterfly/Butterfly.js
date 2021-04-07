const THREE = require('three');
const SIZE = 280;

export default class Butterfly {
  constructor(i, texture) {
    this.uniforms = {
      index: {
        type: 'f',
        value: i
      },
      time: {
        type: 'f',
        value: 0
      },
      size: {
        type: 'f',
        value: SIZE
      },
      texture: {
        type: 't',
        value: texture
      },
      colorH: {
        type: 'f',
        value: Math.random()
      },
    }
    this.obj = this.createObj();
    this.obj.renderOrder = 10;
  }
  createObj() {
    const geometry = new THREE.PlaneGeometry(SIZE, SIZE / 2, 24, 12);
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: require('./glsl/butterfly.vs').default,
        fragmentShader: require('./glsl/butterfly.fs').default,
        side: THREE.DoubleSide,
        transparent: true,
      })
    );
    mesh.position.y = SIZE * 0.5 + (Math.random() * 2 - 1) * SIZE * 0.1;
    mesh.rotation.set(-45 * Math.PI / 180, 0, 0);
    return mesh;
  }
  render(renderer, time) {
    this.uniforms.time.value += time;
    this.obj.position.z -= 4;
    if (this.obj.position.z < -900) {
      this.obj.position.x = (Math.random() * 2 - 1) * 280;
      this.obj.position.z = 900;
      this.uniforms.colorH.value = Math.random();
    }
  }
}
