const glslify = require('glslify');

export default class Butterfly {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      texture: {
        type: 't',
        value: null
      }
    }
  }
  loadTexture(images, callback) {
    const loader = new THREE.TextureLoader();
    loader.load(images, (texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      this.uniforms.texture.value = texture;
      this.obj = this.createObj();
      callback();
    });
  }
  createObj() {
    const geometry = new THREE.PlaneBufferGeometry(20, 20, 2, 2);
    return new THREE.Mesh(
      geometry,
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../../../glsl/sketch/butterfly/butterfly.vs'),
        fragmentShader: glslify('../../../../glsl/sketch/butterfly/butterfly.fs'),
        side: THREE.DoubleSide,
        transparent: true
      })
    );
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
