const glslify = require('glslify');

export default class PhysicsRenderer {
  constructor(length, accelerationShader) {
    this.length = length;
    this.accelerationScene = new THREE.Scene();
    this.velocityScene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    this.option = {
      type: THREE.FloatType,
    };
    this.acceleration = [
      new THREE.WebGLRenderTarget(length, length, this.option),
      new THREE.WebGLRenderTarget(length, length, this.option),
    ];
    this.velocity = [
      new THREE.WebGLRenderTarget(length, length, this.option),
      new THREE.WebGLRenderTarget(length, length, this.option),
    ];
    this.accelerationMesh = this.createMesh(
      glslify('../../../glsl/common/physicsRenderer.vs'),
      accelerationShader
    );
    this.velocityMesh = this.createMesh(
      glslify('../../../glsl/common/physicsRenderer.vs'),
      glslify('../../../glsl/common/physicsRendererVelocity.fs')
    );
    this.targetIndex = 0;
  }
  init(renderer, velocityArray) {
    var accelerationInitMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.ShaderMaterial({
        vertexShader: 'void main(void) {gl_Position = vec4(position, 1.0);}',
        fragmentShader: 'void main(void) {gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);}',
      })
    );
    var velocityInitTex = new THREE.DataTexture(velocityArray, this.length, this.length, THREE.RGBFormat, THREE.FloatType);
    velocityInitTex.needsUpdate = true;
    var velocityInitMesh = new THREE.Mesh(
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

    this.accelerationScene.add(this.camera);
    this.accelerationScene.add(accelerationInitMesh);
    renderer.render(this.accelerationScene, this.camera, this.acceleration[0]);
    renderer.render(this.accelerationScene, this.camera, this.acceleration[1]);
    this.accelerationScene.remove(accelerationInitMesh);
    this.accelerationScene.add(this.accelerationMesh);

    this.velocityScene.add(this.camera);
    this.velocityScene.add(velocityInitMesh);
    renderer.render(this.velocityScene, this.camera, this.velocity[0]);
    renderer.render(this.velocityScene, this.camera, this.velocity[1]);
    this.velocityScene.remove(velocityInitMesh);
    this.velocityScene.add(this.velocityMesh);
  }
  createMesh(vs, fs) {
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: {
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
        },
        vertexShader: vs,
        fragmentShader: fs,
      })
    );
  }
  render(renderer) {
    const prevIndex = Math.abs(this.targetIndex - 1);
    const nextIndex = this.targetIndex;
    this.accelerationMesh.material.uniforms.acceleration.value = this.acceleration[prevIndex];
    this.accelerationMesh.material.uniforms.velocity.value = this.velocity[nextIndex];
    renderer.render(this.accelerationScene, this.camera, this.acceleration[nextIndex]);
    this.velocityMesh.material.uniforms.acceleration.value = this.acceleration[nextIndex];
    this.velocityMesh.material.uniforms.velocity.value = this.velocity[nextIndex];
    renderer.render(this.velocityScene, this.camera, this.velocity[prevIndex]);
    this.targetIndex = prevIndex;
  }
  getCurrentVelocity() {
    return this.velocity[Math.abs(this.targetIndex - 1)];
  }
  getCurrentAcceleration() {
    return this.acceleration[Math.abs(this.targetIndex - 1)];
  }
  resize(length) {
    this.length = length;
    this.velocity[0].setSize(length, length);
    this.velocity[1].setSize(length, length);
    this.acceleration[0].setSize(length, length);
    this.acceleration[1].setSize(length, length);
  }
}
