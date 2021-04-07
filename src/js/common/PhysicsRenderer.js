const THREE = require('three');

export default class PhysicsRenderer {
  constructor(aVertexShader, aFragmentShader, vVertexShader, vFragmentShader) {
    this.side = 0;
    this.aScene = new THREE.Scene();
    this.vScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    this.option = {
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter
    };
    this.acceleration = [
      new THREE.WebGLRenderTarget(0, 0, this.option),
      new THREE.WebGLRenderTarget(0, 0, this.option),
    ];
    this.velocity = [
      new THREE.WebGLRenderTarget(0, 0, this.option),
      new THREE.WebGLRenderTarget(0, 0, this.option),
    ];
    this.aUniforms = {
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(document.body.clientWidth, window.innerHeight),
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
        value: new THREE.Vector2(document.body.clientWidth, window.innerHeight),
      },
      side: {
        type: 'f',
        value: 0
      },
      velocityInit: {
        type: 't',
        value: null,
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
  init(renderer, velocityArrayBase, aAttributesBase, vAttributesBase) {
    this.side = Math.ceil(Math.sqrt(velocityArrayBase.length / 3));
    this.vUniforms.side.value = this.side;
    const velocityArray = [];
    for (var i = 0; i < Math.pow(this.side, 2) * 3; i += 3) {
      if(velocityArrayBase[i] != undefined) {
        velocityArray[i + 0] = velocityArrayBase[i + 0];
        velocityArray[i + 1] = velocityArrayBase[i + 1];
        velocityArray[i + 2] = velocityArrayBase[i + 2];
        this.uvs[i / 3 * 2 + 0] = (i / 3) % this.side / (this.side - 1);
        this.uvs[i / 3 * 2 + 1] = Math.floor((i / 3) / this.side) / (this.side - 1);
      } else {
        velocityArray[i + 0] = 0;
        velocityArray[i + 1] = 0;
        velocityArray[i + 2] = 0;
      }
    }
    if (aAttributesBase) {
      const aAttributes = {};
      const aAttributeKeys = Object.keys(aAttributesBase);
      if (aAttributeKeys.length) {
        for (var i = 0; i < aAttributeKeys.length; i++) {
          const aAttribute = aAttributesBase[aAttributeKeys[i]];
          for (var j = aAttribute.array.length; j < velocityArray.length / 3 * aAttribute.itemSize; j++) {
            aAttribute.array.push(0);
          }
          this.accelerationMesh.geometry.setAttribute(
            aAttributeKeys[i],
            new THREE.BufferAttribute(new Float32Array(aAttribute.array), aAttribute.itemSize)
          );
        }
      }
    }
    if (vAttributesBase) {
      const vAttributes = {};
      const vAttributeKeys = Object.keys(vAttributesBase);
      if (vAttributeKeys.length) {
        for (var i = 0; i < vAttributeKeys.length; i++) {
          const vAttribute = vAttributesBase[vAttributeKeys[i]];
          for (var j = vAttribute.array.length; j < velocityArray.length / 3 * vAttribute.itemSize; j++) {
            vAttribute.array.push(0);
          }
          this.velocityMesh.geometry.setAttribute(
            vAttributeKeys[i],
            new THREE.BufferAttribute(new Float32Array(vAttribute.array), vAttribute.itemSize)
          );
        }
      }
    }
    this.vUniforms.velocityInit.value = new THREE.DataTexture(new Float32Array(velocityArray), this.side, this.side, THREE.RGBFormat, THREE.FloatType);
    this.vUniforms.velocityInit.value.needsUpdate = true;
    const velocityInitMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: {
          velocity: {
            type: 't',
            value: this.vUniforms.velocityInit.value,
          },
        },
        vertexShader: require('./glsl/physicsRenderer.vs').default,
        fragmentShader: require('./glsl/physicsRendererVelocityInit.fs').default,
      })
    );
    for (var i = 0; i < 2; i++) {
      this.acceleration[i].setSize(this.side, this.side);
      this.velocity[i].setSize(this.side, this.side);
    }
    this.vScene.add(this.camera);
    this.vScene.add(velocityInitMesh);
    renderer.setRenderTarget(this.velocity[0]);
    renderer.render(this.vScene, this.camera);
    renderer.setRenderTarget(this.velocity[1]);
    renderer.render(this.vScene, this.camera);
    this.vScene.remove(velocityInitMesh);
    this.vScene.add(this.velocityMesh);
    this.aScene.add(this.accelerationMesh);
  }
  createMesh(uniforms, vs, fs) {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
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
    renderer.setRenderTarget(this.acceleration[nextIndex]);
    renderer.render(this.aScene, this.camera);
    this.vUniforms.acceleration.value = this.acceleration[nextIndex].texture;
    this.vUniforms.velocity.value = this.velocity[nextIndex].texture;
    renderer.setRenderTarget(this.velocity[prevIndex]);
    renderer.render(this.vScene, this.camera);
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
    this.aUniforms.resolution.value.set(document.body.clientWidth, window.clientHeight);
    this.vUniforms.resolution.value.set(document.body.clientWidth, window.clientHeight);
  }
}
