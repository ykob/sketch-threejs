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
    };
    this.num = 1000;
    this.obj = null;
  }
  createTexture() {
    var grid = 80;
    var text = '観自在菩薩 行深般若波羅蜜多時 照見五蘊皆空 度一切苦厄 舎利子 色不異空 空不異色 色即是空 空即是色 受想行識亦復如是 舎利子 是諸法空相 不生不滅 不垢不浄 不増不減 是故空中 無色無受想行識 無眼耳鼻舌身意 無色声香味触法 無眼界乃至無意識界 無無明亦無無明尽 乃至無老死 亦無老死尽 無苦集滅道 無智亦無得 以無所得故 菩提薩埵 依般若波羅蜜多故 心無罣礙 無罣礙故 無有恐怖 遠離一切顛倒夢想 究竟涅槃 三世諸仏 依般若波羅蜜多故 得阿耨多羅三藐三菩提 故知般若波羅蜜多 是大神呪 是大明呪 是無上呪 是無等等呪 能除一切苦 真実不虚 故説般若波羅蜜多呪 即説呪日 羯諦羯諦 波羅羯諦 波羅僧羯諦 菩提薩婆訶 般若心経';
    var length = text.length;
    var colMax = 15;
    var rowMax = Math.ceil(length / colMax);
    var geometry = null;
    var material = null;
    var particle = null;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d', {
      alpha: true
    });
    var fontSize = 100;

    canvas.width = fontSize * colMax;
    canvas.height = fontSize * rowMax;
    ctx.fillStyle = '#333333';
    ctx.font = font_size + 'px serif';
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
