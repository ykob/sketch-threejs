import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import promiseTextureLoader from '../../common/PromiseTextureLoader';

const DURATION = 4;
let iPositions = undefined;
let iUvs = undefined;
let iIds = undefined;
let iTimes = undefined;
let iIsAnimated = undefined;
let iScales = undefined;
let iMoves = undefined;
let num = 0;
let animateId = 0;
let interval = 0;

export default class Typo {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      texHannyaShingyo: {
        type: 't',
        value: undefined
      },
      unitUv: {
        type: 'f',
        value: 0
      },
      duration: {
        type: 'f',
        value: DURATION
      },
    };
    this.obj;
  }
  async createObj() {
    const text = '観自在菩薩行深般若波羅蜜多時照見五蘊皆空度一切苦厄舎利子色不異空空不異色色即是空空即是色受想行識亦復如是舎利子是諸法空相不生不滅不垢不浄不増不減是故空中無色無受想行識無眼耳鼻舌身意無色声香味触法無眼界乃至無意識界無無明亦無無明尽乃至無老死亦無老死尽無苦集滅道無智亦無得以無所得故菩提薩埵依般若波羅蜜多故心無罣礙無罣礙故無有恐怖遠離一切顛倒夢想究竟涅槃三世諸仏依般若波羅蜜多故得阿耨多羅三藐三菩提故知般若波羅蜜多是大神呪是大明呪是無上呪是無等等呪能除一切苦真実不虚故説般若波羅蜜多呪即説呪日羯諦羯諦波羅羯諦波羅僧羯諦菩提薩婆訶般若心経';
    const widthPerSide = 2048;
    const gridsPerSide = Math.ceil(Math.sqrt(text.length));
    const fontSize = widthPerSide / gridsPerSide;

    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneBufferGeometry(6, 6);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    num = text.length;
    iPositions = new THREE.InstancedBufferAttribute(new Float32Array(num * 3), 3);
    iUvs = new THREE.InstancedBufferAttribute(new Float32Array(num * 2), 2);
    iIds = new THREE.InstancedBufferAttribute(new Float32Array(num), 1);
    iTimes = new THREE.InstancedBufferAttribute(new Float32Array(num), 1);
    iIsAnimated = new THREE.InstancedBufferAttribute(new Float32Array(num), 1);
    iScales = new THREE.InstancedBufferAttribute(new Float32Array(num), 1);
    iMoves = new THREE.InstancedBufferAttribute(new Float32Array(num), 1);

    for (var y = 0; y < gridsPerSide; y++) {
      for (var x = 0; x < gridsPerSide; x++) {
        const i = y * gridsPerSide + x;

        // define instance buffer attributes.
        const radian = MathEx.radians(Math.random() * 360);
        const radius = Math.random() * 20 + 5;
        iUvs.setXY(i, x / gridsPerSide, (gridsPerSide - y - 1) / gridsPerSide);
        iIds.setX(i, i);
      }
    }

    // Define attributes of the instancing geometry
    geometry.addAttribute('iPosition',  iPositions);
    geometry.addAttribute('iUv',  iUvs);
    geometry.addAttribute('iId',  iIds);
    geometry.addAttribute('iTime',  iTimes);
    geometry.addAttribute('iIsAnimated',  iIsAnimated);
    geometry.addAttribute('iScale',  iScales);
    geometry.addAttribute('iMove',  iMoves);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/typo.vs').default,
      fragmentShader: require('./glsl/typo.fs').default,
      transparent: true,
      depthWrite: false,
    });

    this.uniforms.texHannyaShingyo.value = await promiseTextureLoader('/sketch-threejs/img/sketch/buddha/hannya_text.png');
    this.uniforms.unitUv.value = 1 / gridsPerSide;

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.position.y = 0.0;
    this.obj.frustumCulled = false;
  }
  render(time) {
    this.uniforms.time.value += time;
    interval += time;

    if (interval > 0.5) {
      const radian = MathEx.radians(Math.random() * 270 - 45);
      const radius = Math.random() * 12 + 12;
      iPositions.setXYZ(
        animateId,
        Math.cos(radian) * radius,
        0,
        Math.sin(radian) * radius
      );
      iIsAnimated.setX(animateId, 1);
      iScales.setX(animateId, (Math.random() + Math.random() - 1) * 0.1 + 1);
      iMoves.setX(animateId, (Math.random() + Math.random() - 1) * 5 + 30);
      iPositions.needsUpdate = true;
      iIsAnimated.needsUpdate = true;
      iScales.needsUpdate = true;
      iMoves.needsUpdate = true;
      interval = 0;
      animateId = (animateId >= num - 1) ? 0 : animateId + 1;
    }

    for (var i = 0; i < num; i++) {
      if (iIsAnimated.getX(i) === 0) continue;
      const past =  iTimes.getX(i);
      if (past > DURATION) {
        iIsAnimated.setX(i, 0);
        iTimes.setX(i, 0);
      } else {
        iTimes.setX(i, past + time);
      }
    }
    iIsAnimated.needsUpdate = true;
    iTimes.needsUpdate = true;
  }
}
