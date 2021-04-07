import * as THREE from 'three';

import vs from './glsl/physicsRenderer.vs';
import fs from './glsl/physicsRendererInit.fs';

const createMesh = (uniforms, vs, fs) => {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: vs,
      fragmentShader: fs
    })
  );
};

export default class PhysicsRenderer {
  constructor(avs, afs, vvs, vfs) {
    const option = {
      type: (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) ? THREE.HalfFloatType : THREE.FloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter
    };

    this.side = 0;
    this.aScene = new THREE.Scene();
    this.vScene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera();
    this.acceleration = [
      new THREE.WebGLRenderTarget(0, 0, option),
      new THREE.WebGLRenderTarget(0, 0, option)
    ];
    this.velocity = [
      new THREE.WebGLRenderTarget(0, 0, option),
      new THREE.WebGLRenderTarget(0, 0, option)
    ];
    this.aUniforms = {
      velocity: {
        value: null
      },
      acceleration: {
        value: null
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
        value: null
      },
      acceleration: {
        value: null
      },
      time: {
        value: 0
      }
    };
    this.aMesh = createMesh(this.aUniforms, avs, afs);
    this.vMesh = createMesh(this.vUniforms, vvs, vfs);
    this.uvs = [];
    this.targetIndex = 0;
  }
  start(renderer, aArrayBase, vArrayBase, aAttrBase, vAttrBase) {
    this.side = this.vUniforms.side.value = Math.ceil(
      Math.sqrt(vArrayBase.length / 3)
    );
    this.camera.top = this.side * 0.5;
    this.camera.bottom = this.side * -0.5;
    this.camera.right = this.side * 0.5;
    this.camera.left = this.side * -0.5;
    this.camera.position.z = 10;

    // make arrays of velocity and acceleration.
    const aArray = [];
    const vArray = [];

    for (var i = 0; i < Math.pow(this.side, 2) * 3; i += 3) {
      // set acceleration values from arguments.
      if (aArrayBase && aArrayBase[i] != undefined) {
        aArray[i + 0] = aArrayBase[i + 0];
        aArray[i + 1] = aArrayBase[i + 1];
        aArray[i + 2] = aArrayBase[i + 2];
      } else {
        aArray[i + 0] = 0;
        aArray[i + 1] = 0;
        aArray[i + 2] = 0;
      }

      // set velocity values from arguments.
      if (vArrayBase && vArrayBase[i] != undefined) {
        vArray[i + 0] = vArrayBase[i + 0];
        vArray[i + 1] = vArrayBase[i + 1];
        vArray[i + 2] = vArrayBase[i + 2];
      } else {
        vArray[i + 0] = 0;
        vArray[i + 1] = 0;
        vArray[i + 2] = 0;
      }

      // define UV to allow other objects to see the velocity value.
      this.uvs[(i / 3) * 2 + 0] = ((i / 3) % this.side) / (this.side - 1);
      this.uvs[(i / 3) * 2 + 1] =
        Math.floor(i / 3 / this.side) / (this.side - 1);
    }

    // set the buffer attribute of acceleration.
    if (aAttrBase) {
      const aAttributeKeys = Object.keys(aAttrBase);

      if (aAttributeKeys.length) {
        for (var i2 = 0; i2 < aAttributeKeys.length; i2++) {
          const aAttribute = aAttrBase[aAttributeKeys[i2]];

          for (
            var j = aAttribute.array.length;
            j < (vArray.length / 3) * aAttribute.itemSize;
            j++
          ) {
            aAttribute.array.push(0);
          }
          this.aMesh.geometry.setAttribute(
            aAttributeKeys[i2],
            new THREE.BufferAttribute(
              new Float32Array(aAttribute.array),
              aAttribute.itemSize
            )
          );
        }
      }
    }

    // set the buffer attribute of velocity.
    if (vAttrBase) {
      const vAttributeKeys = Object.keys(vAttrBase);

      if (vAttributeKeys.length) {
        for (var i3 = 0; i3 < vAttributeKeys.length; i3++) {
          const vAttribute = vAttrBase[vAttributeKeys[i3]];

          for (
            var j2 = vAttribute.array.length;
            j2 < (vArray.length / 3) * vAttribute.itemSize;
            j2++
          ) {
            vAttribute.array.push(0);
          }
          this.vMesh.geometry.setAttribute(
            vAttributeKeys[i3],
            new THREE.BufferAttribute(
              new Float32Array(vAttribute.array),
              vAttribute.itemSize
            )
          );
        }
      }
    }

    for (var i4 = 0; i4 < 2; i4++) {
      this.acceleration[i4].setSize(this.side, this.side);
      this.velocity[i4].setSize(this.side, this.side);
    }

    // set acceleration of the first frame.
    const aInitData = new THREE.DataTexture(
      new Float32Array(aArray),
      this.side,
      this.side,
      THREE.RGBFormat,
      THREE.FloatType
    );

    aInitData.format = THREE.RGBFormat;
    aInitData.type = THREE.FloatType;
    aInitData.magFilter = THREE.NearestFilter;
    aInitData.minFilter = THREE.NearestFilter;
    aInitData.needsUpdate = true;

    const accelerationInitMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: {
          initData: {
            value: aInitData
          }
        },
        vertexShader: vs,
        fragmentShader: fs
      })
    );

    this.aScene.add(this.camera);
    this.aScene.add(accelerationInitMesh);
    renderer.setRenderTarget(this.acceleration[Math.abs(this.targetIndex - 1)]);
    renderer.render(this.aScene, this.camera);
    this.aScene.remove(accelerationInitMesh);
    this.aScene.add(this.aMesh);

    // set velocity of the first frame.
    const vInitData = new THREE.DataTexture(
      new Float32Array(vArray),
      this.side,
      this.side
    );

    vInitData.format = THREE.RGBFormat;
    vInitData.type = THREE.FloatType;
    vInitData.magFilter = THREE.NearestFilter;
    vInitData.minFilter = THREE.NearestFilter;
    vInitData.needsUpdate = true;

    const velocityInitMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: {
          initData: {
            value: vInitData
          }
        },
        vertexShader: vs,
        fragmentShader: fs
      })
    );

    this.vScene.add(this.camera);
    this.vScene.add(velocityInitMesh);
    renderer.setRenderTarget(this.velocity[this.targetIndex]);
    renderer.render(this.vScene, this.camera);
    this.vScene.remove(velocityInitMesh);
    this.vScene.add(this.vMesh);
  }
  update(renderer, time) {
    const prevIndex = Math.abs(this.targetIndex - 1);
    const nextIndex = this.targetIndex;

    // update velocity.
    this.aUniforms.acceleration.value = this.acceleration[prevIndex].texture;
    this.aUniforms.velocity.value = this.velocity[nextIndex].texture;
    renderer.setRenderTarget(this.acceleration[nextIndex]);
    renderer.render(this.aScene, this.camera);

    // update acceleration.
    this.vUniforms.acceleration.value = this.acceleration[nextIndex].texture;
    this.vUniforms.velocity.value = this.velocity[nextIndex].texture;
    renderer.setRenderTarget(this.velocity[prevIndex]);
    renderer.render(this.vScene, this.camera);

    renderer.setRenderTarget(null);

    // update the index number of the renderTarget array.
    this.targetIndex = prevIndex;

    // update the time.
    this.aUniforms.time.value += time;
    this.vUniforms.time.value += time;
  }
  getBufferAttributeUv({ instanced = false }) {
    return instanced
      ? new THREE.InstancedBufferAttribute(new Float32Array(this.uvs), 2)
      : new THREE.BufferAttribute(new Float32Array(this.uvs), 2);
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
  createDataTexture(arrayBase) {
    const array = [];

    for (var i = 0; i < Math.pow(this.side, 2) * 3; i += 3) {
      if (arrayBase[i] != undefined) {
        array[i + 0] = arrayBase[i + 0];
        array[i + 1] = arrayBase[i + 1];
        array[i + 2] = arrayBase[i + 2];
      } else {
        array[i + 0] = 0;
        array[i + 1] = 0;
        array[i + 2] = 0;
      }
    }

    return new THREE.DataTexture(
      new Float32Array(array),
      this.side,
      this.side,
      THREE.RGBFormat,
      THREE.FloatType
    );
  }
}
