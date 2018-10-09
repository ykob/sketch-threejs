const THREE = require('three');
const glslify = require('glslify');
const MathEx = require('js-util/MathEx');

export default class InstanceMesh {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      texHannyaShingyo: {
        type: 't',
        value: null
      },
    };
    this.num = 1000;
    this.obj = null;
  }
  createTexture() {
    const text = '観自在菩薩行深般若波羅蜜多時照見五蘊皆空度一切苦厄舎利子色不異空空不異色色即是空空即是色受想行識亦復如是舎利子是諸法空相不生不滅不垢不浄不増不減是故空中無色無受想行識無眼耳鼻舌身意無色声香味触法無眼界乃至無意識界無無明亦無無明尽乃至無老死亦無老死尽無苦集滅道無智亦無得以無所得故菩提薩埵依般若波羅蜜多故心無罣礙無罣礙故無有恐怖遠離一切顛倒夢想究竟涅槃三世諸仏依般若波羅蜜多故得阿耨多羅三藐三菩提故知般若波羅蜜多是大神呪是大明呪是無上呪是無等等呪能除一切苦真実不虚故説般若波羅蜜多呪即説呪日羯諦羯諦波羅羯諦波羅僧羯諦菩提薩婆訶般若心経';
    const widthPerSide = 2048;
    const gridsPerSide = Math.ceil(Math.sqrt(text.length));
    const fontSize = widthPerSide / gridsPerSide;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {
      alpha: true
    });

    canvas.width = canvas.height = widthPerSide;
    ctx.fillStyle = '#000000';
    ctx.font = fontSize + 'px serif';
    for (var y = 0; y < gridsPerSide; y++) {
      for (var x = 0; x < gridsPerSide; x++) {
        var str = text.substr(y * gridsPerSide + x, 1);
        ctx.fillText(str, fontSize * x, fontSize * (y + 1) - fontSize * 0.15);
      }
    }


  }
  createObj() {
    this.createTexture();

    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneBufferGeometry(10, 10, 10);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3);
    for ( var i = 0, ul = this.num; i < ul; i++ ) {
      instancePositions.setXYZ(i, 0, 0, 0);
    }
    geometry.addAttribute('instancePosition', instancePositions);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: glslify('./glsl/typo.vs'),
      fragmentShader: glslify('./glsl/typo.fs'),
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.frustumCulled = false;
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
