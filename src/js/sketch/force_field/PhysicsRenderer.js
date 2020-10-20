import * as THREE from 'three';

import vs from './glsl/physicsRenderer.vs';
import fs from './glsl/physicsRendererInit.fs';

const createMesh = (uniforms, vs, fs) => {
  return new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2),
    new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: vs,
      fragmentShader: fs
    })
  );
};

export default class PhysicsRenderer {
  constructor(aVertexShader, aFragmentShader, vVertexShader, vFragmentShader) {
    const option = {
      type: THREE.FloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter
    };

    this.side = 0;
    this.aScene = new THREE.Scene();
    this.vScene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera();
    this.acceleration = [
      new THREE.WebGLRenderTarget(0, 0, option),
      new THREE.WebGLRenderTarget(0, 0, option),
    ];
    this.velocity = [
      new THREE.WebGLRenderTarget(0, 0, option),
      new THREE.WebGLRenderTarget(0, 0, option),
    ];
    this.aUniforms = {
      velocity: {
        value: null,
      },
      acceleration: {
        value: null,
      },
      time: {
        value: 0
      }
    };
    this.vUniforms = {
      side: {
        value: 0
      },
      velocity: {
        value: null,
      },
      acceleration: {
        value: null,
      },
      time: {
        value: 0
      }
    };
    this.accelerationMesh = createMesh(
      this.aUniforms,
      aVertexShader,
      aFragmentShader
    );
    this.velocityMesh = createMesh(
      this.vUniforms,
      vVertexShader,
      vFragmentShader
    );
    this.uvs = [];
    this.targetIndex = 0;
    console.log(this.vUniforms);
  }
  start(renderer, velocityArrayBase, accelerationArrayBase, aAttributesBase, vAttributesBase) {
    this.side = this.vUniforms.side.value = Math.ceil(Math.sqrt(velocityArrayBase.length / 3));
    this.camera.top = this.side * 0.5;
    this.camera.bottom = this.side * -0.5;
    this.camera.right = this.side * 0.5;
    this.camera.left = this.side * -0.5;
    this.camera.position.z = 10;

    const velocityArray = [];
    const accelerationArray = [];

    for (var i = 0; i < Math.pow(this.side, 2) * 3; i += 3) {
      if (velocityArrayBase[i] != undefined) {
        velocityArray[i + 0] = velocityArrayBase[i + 0];
        velocityArray[i + 1] = velocityArrayBase[i + 1];
        velocityArray[i + 2] = velocityArrayBase[i + 2];
      } else {
        velocityArray[i + 0] = 0;
        velocityArray[i + 1] = 0;
        velocityArray[i + 2] = 0;
      }
      if (accelerationArrayBase && accelerationArrayBase[i] != undefined) {
        accelerationArray[i + 0] = accelerationArrayBase[i + 0];
        accelerationArray[i + 1] = accelerationArrayBase[i + 1];
        accelerationArray[i + 2] = accelerationArrayBase[i + 2];
      } else {
        accelerationArray[i + 0] = 0;
        accelerationArray[i + 1] = 0;
        accelerationArray[i + 2] = 0;
      }
      this.uvs[i / 3 * 2 + 0] = (i / 3) % this.side / (this.side - 1);
      this.uvs[i / 3 * 2 + 1] = Math.floor((i / 3) / this.side) / (this.side - 1);
    }

    if (aAttributesBase) {
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

    for (var i = 0; i < 2; i++) {
      this.acceleration[i].setSize(this.side, this.side);
      this.velocity[i].setSize(this.side, this.side);
    }

    const velocityInitData = new THREE.DataTexture(
      new Float32Array(velocityArray),
      this.side,
      this.side,
      THREE.RGBFormat,
      THREE.FloatType
    );
    velocityInitData.needsUpdate = true;
    const velocityInitMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: {
          initData: {
            value: velocityInitData
          }
        },
        vertexShader: vs,
        fragmentShader: fs,
      })
    );
    this.vScene.add(this.camera);
    this.vScene.add(velocityInitMesh);
    renderer.setRenderTarget(this.velocity[this.targetIndex]);
    renderer.render(this.vScene, this.camera);
    this.vScene.remove(velocityInitMesh);
    this.vScene.add(this.velocityMesh);

    const accelerationInitData = new THREE.DataTexture(
      new Float32Array(accelerationArray),
      this.side,
      this.side,
      THREE.RGBFormat,
      THREE.FloatType
    );
    accelerationInitData.needsUpdate = true;
    const accelerationInitMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(this.side, this.side),
      new THREE.RawShaderMaterial({
        uniforms: {
          initData: {
            value: accelerationInitData
          }
        },
        vertexShader: vs,
        fragmentShader: fs,
      })
    );    
    this.aScene.add(this.camera);
    this.aScene.add(accelerationInitMesh);
    renderer.setRenderTarget(this.acceleration[Math.abs(this.targetIndex - 1)]);
    renderer.render(this.aScene, this.camera);
    this.aScene.remove(accelerationInitMesh);
    this.aScene.add(this.accelerationMesh);
  }
  update(renderer, time) {
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
}
