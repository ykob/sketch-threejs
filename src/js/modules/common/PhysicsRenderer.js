
const glslify = require('glslify');

export default class PhysicsRenderer {
  constructor(aVertexShader, aFragmentShader, vVertexShader, vFragmentShader) {
    this.length = 0;
    this.aScene = new THREE.Scene();
    this.vScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    this.option = {
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter
    };
    this.acceleration = [
      new THREE.WebGLRenderTarget(length, length, this.option),
      new THREE.WebGLRenderTarget(length, length, this.option),
    ];
    this.velocity = [
      new THREE.WebGLRenderTarget(length, length, this.option),
      new THREE.WebGLRenderTarget(length, length, this.option),
    ];
    this.aUniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      velocity: {
        type: 't',
        value: null,
      },
      acceleration: {
        type: 't',
        value: null,
      },
      time: {
        type: 'f',
        value: 0
      }
    };
    this.vUniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      velocity: {
        type: 't',
        value: null,
      },
      acceleration: {
        type: 't',
        value: null,
      },
      time: {
        type: 'f',
        value: 0
      }
    };
    this.accelerationMesh = this.createMesh(
      this.aUniforms,
      aVertexShader,
      aFragmentShader
    );
    this.velocityMesh = this.createMesh(
      this.vUniforms,
      vVertexShader,
      vFragmentShader
    );
    this.uvs = [];
    this.targetIndex = 0;
  }
  init(renderer, velocityArrayBase) {
    this.length = Math.ceil(Math.sqrt(velocityArrayBase.length / 3));
    const velocityArray = [];
    for (var i = 0; i < Math.pow(this.length, 2) * 3; i += 3) {
      if(velocityArrayBase[i] != undefined) {
        velocityArray[i + 0] = velocityArrayBase[i + 0];
        velocityArray[i + 1] = velocityArrayBase[i + 1];
        velocityArray[i + 2] = velocityArrayBase[i + 2];
        this.uvs[i / 3 * 2 + 0] = (i / 3) % this.length / (this.length - 1);
        this.uvs[i / 3 * 2 + 1] = Math.floor((i / 3) / this.length) / (this.length - 1);
      } else {
        velocityArray[i + 0] = 0;
        velocityArray[i + 1] = 0;
        velocityArray[i + 2] = 0;
      }
    }
    const velocityInitTex = new THREE.DataTexture(new Float32Array(velocityArray), this.length, this.length, THREE.RGBFormat, THREE.FloatType);
    velocityInitTex.needsUpdate = true;
    const velocityInitMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: {
          velocity: {
            type: 't',
            value: velocityInitTex,
          },
        },
        vertexShader: glslify('../../../glsl/common/physicsRenderer.vs'),
        fragmentShader: glslify('../../../glsl/common/physicsRendererVelocityInit.fs'),
      })
    );
    for (var i = 0; i < 2; i++) {
      this.acceleration[i].setSize(this.length, this.length);
      this.velocity[i].setSize(this.length, this.length);
    }
    this.vScene.add(this.camera);
    this.vScene.add(velocityInitMesh);
    renderer.render(this.vScene, this.camera, this.velocity[0]);
    renderer.render(this.vScene, this.camera, this.velocity[1]);
    this.vScene.remove(velocityInitMesh);
    this.vScene.add(this.velocityMesh);
    this.aScene.add(this.accelerationMesh);
  }
  createMesh(uniforms, vs, fs) {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vs,
        fragmentShader: fs,
      })
    );
  }
  render(renderer, time) {
    const prevIndex = Math.abs(this.targetIndex - 1);
    const nextIndex = this.targetIndex;
    this.aUniforms.acceleration.value = this.acceleration[prevIndex].texture;
    this.aUniforms.velocity.value = this.velocity[nextIndex].texture;
    renderer.render(this.aScene, this.camera, this.acceleration[nextIndex]);
    this.vUniforms.acceleration.value = this.acceleration[nextIndex].texture;
    this.vUniforms.velocity.value = this.velocity[nextIndex].texture;
    renderer.render(this.vScene, this.camera, this.velocity[prevIndex]);
    this.targetIndex = prevIndex;
    this.aUniforms.time.value += time;
    this.vUniforms.time.value += time;
  }
  getBufferAttributeUv() {
    return new THREE.BufferAttribute(new Float32Array(this.uvs), 2);
  }
  getCurrentVelocity() {
    return this.velocity[Math.abs(this.targetIndex - 1)].texture;
  }
  getCurrentAcceleration() {
    return this.acceleration[Math.abs(this.targetIndex - 1)].texture;
  }
  mergeAUniforms(obj) {
    this.aUniforms = Object.assign(this.aUniforms, obj);
  }
  mergeVUniforms(obj) {
    this.vUniforms = Object.assign(this.vUniforms, obj);
  }
  resize(length) {
    this.length = length;
    this.velocity[0].setSize(length, length);
    this.velocity[1].setSize(length, length);
    this.acceleration[0].setSize(length, length);
    this.acceleration[1].setSize(length, length);
  }
}
