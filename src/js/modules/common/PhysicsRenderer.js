
const glslify = require('glslify');

export default class PhysicsRenderer {
  constructor(accelerationShader, velocityShader) {
    this.length = 0;
    this.accelerationScene = new THREE.Scene();
    this.velocityScene = new THREE.Scene();
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
    this.accelerationUniforms = {
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
    this.velocityUniforms = {
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
      this.accelerationUniforms,
      glslify('../../../glsl/common/physicsRenderer.vs'),
      accelerationShader
    );
    this.velocityMesh = this.createMesh(
      this.velocityUniforms,
      glslify('../../../glsl/common/physicsRenderer.vs'),
      velocityShader
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
        this.uvs[i / 3 * 2 + 0] = (i / 3) % this.length / (this.length - 1),
        this.uvs[i / 3 * 2 + 1] = Math.floor((i / 3) / this.length) / (this.length - 1)
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
    this.velocityScene.add(this.camera);
    this.velocityScene.add(velocityInitMesh);
    renderer.render(this.velocityScene, this.camera, this.velocity[0]);
    renderer.render(this.velocityScene, this.camera, this.velocity[1]);
    this.velocityScene.remove(velocityInitMesh);
    this.velocityScene.add(this.velocityMesh);
    this.accelerationScene.add(this.accelerationMesh);
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
    this.accelerationUniforms.acceleration.value = this.acceleration[prevIndex].texture;
    this.accelerationUniforms.velocity.value = this.velocity[nextIndex].texture;
    renderer.render(this.accelerationScene, this.camera, this.acceleration[nextIndex]);
    this.velocityUniforms.acceleration.value = this.acceleration[nextIndex].texture;
    this.velocityUniforms.velocity.value = this.velocity[nextIndex].texture;
    renderer.render(this.velocityScene, this.camera, this.velocity[prevIndex]);
    this.targetIndex = prevIndex;
    this.accelerationUniforms.time.value += time;
    this.velocityUniforms.time.value += time;
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
  resize(length) {
    this.length = length;
    this.velocity[0].setSize(length, length);
    this.velocity[1].setSize(length, length);
    this.acceleration[0].setSize(length, length);
    this.acceleration[1].setSize(length, length);
  }
}
