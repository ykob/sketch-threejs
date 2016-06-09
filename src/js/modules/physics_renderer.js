var glslify = require('glslify');

var exports = function(){
  var PhysicsRenderer = function(renderer, length) {
    this.length = Math.pow(length, 2);
    this.acceleration_scene = new THREE.Scene();
    this.velocity_scene = new THREE.Scene();
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
    this.acceleration_init_mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: {
        },
        vertexShader: glslify('../../glsl/physics_renderer.vs'),
        fragmentShader: glslify('../../glsl/physics_renderer_acceleration_init.fs'),
      })
    );
    this.velocity_init_mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: {
        },
        vertexShader: glslify('../../glsl/physics_renderer.vs'),
        fragmentShader: glslify('../../glsl/physics_renderer_velocity_init.fs'),
      })
    );
    this.acceleration_mesh = this.createMesh(
      glslify('../../glsl/physics_renderer.vs'),
      glslify('../../glsl/physics_renderer_acceleration.fs')
    );
    this.velocity_mesh = this.createMesh(
      glslify('../../glsl/physics_renderer.vs'),
      glslify('../../glsl/physics_renderer_velocity.fs')
    );
    this.target_index = 0;

    this.acceleration_scene.add(this.camera);
    this.acceleration_scene.add(this.acceleration_init_mesh);
    renderer.render(this.acceleration_scene, this.camera, this.acceleration[0]);
    renderer.render(this.acceleration_scene, this.camera, this.acceleration[1]);
    this.acceleration_scene.remove(this.acceleration_init_mesh);
    this.acceleration_scene.add(this.acceleration_mesh);

    this.velocity_scene.add(this.camera);
    this.velocity_scene.add(this.velocity_init_mesh);
    renderer.render(this.velocity_scene, this.camera, this.velocity[0]);
    renderer.render(this.velocity_scene, this.camera, this.velocity[1]);
    this.velocity_scene.remove(this.velocity_init_mesh);
    this.velocity_scene.add(this.velocity_mesh);
  };
  PhysicsRenderer.prototype = {
    createMesh(vs, fs) {
      return new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2, 2),
        new THREE.ShaderMaterial({
          uniforms: {
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
    },
    render: function(renderer) {
      this.acceleration_mesh.material.uniforms.acceleration.value = this.acceleration[Math.abs(this.target_index - 1)];
      this.acceleration_mesh.material.uniforms.velocity.value = this.velocity[Math.abs(this.target_index)];
      renderer.render(this.acceleration_scene, this.camera, this.acceleration[this.target_index]);
      this.velocity_mesh.material.uniforms.acceleration.value = this.acceleration[this.target_index];
      this.velocity_mesh.material.uniforms.velocity.value = this.velocity[Math.abs(this.target_index - 1)];
      renderer.render(this.velocity_scene, this.camera, this.velocity[this.target_index]);
      this.target_index = Math.abs(this.target_index - 1);
    },
    getCurrentVelocity: function() {
      return this.velocity[this.target_index];
    },
    resize: function(length) {
      this.length = Math.pow(length, 2);
      this.velocity[0].setSize(length, length);
      this.velocity[1].setSize(length, length);
      this.acceleration[0].setSize(length, length);
      this.acceleration[1].setSize(length, length);
    },
  };
  return PhysicsRenderer;
};

module.exports = exports();
