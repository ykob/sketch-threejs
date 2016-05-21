var glslify = require('glslify');

var exports = function(){
  var PhysicsRenderer = function(length) {
    this.length = Math.pow(length, 2);
    this.acceleration_scene = new THREE.Scene();
    this.velocity_scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
    this.acceleration_mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: {
          time: {
            type: 'f',
            value: 0,
          },
          acceleration: {
            type: 't',
            value: null,
          },
        },
        vertexShader: glslify('../../glsl/physics_renderer_acceleration.vs'),
        fragmentShader: glslify('../../glsl/physics_renderer_acceleration.fs'),
      })
    );
    this.velocity_mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: {
          time: {
            type: 'f',
            value: 0,
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
        vertexShader: glslify('../../glsl/physics_renderer_velocity.vs'),
        fragmentShader: glslify('../../glsl/physics_renderer_velocity.fs'),
      })
    );
    this.acceleration = [
      THREE.WebGLRenderTarget(length, length),
      THREE.WebGLRenderTarget(length, length),
    ];
    this.velocity = [
      THREE.WebGLRenderTarget(length, length),
      THREE.WebGLRenderTarget(length, length),
    ];
    this.target_index = 0;

    this.acceleration_scene.add(this.acceleration_mesh);
    this.velocity_scene.add(this.velocity_mesh);
  };
  PhysicsRenderer.prototype = {
    render: function(renderer) {
      this.acceleration_mesh.material.uniforms.acceleration.value = this.acceleration[Math.abs(target_index - 1)];
      renderer.render(this.acceleration_scene, this.camera, this.acceleration[target_index]);
      this.velocity_mesh.material.uniforms.acceleration.value = this.acceleration[target_index];
      this.velocity_mesh.material.uniforms.velocity.value = this.velocity[Math.abs(target_index - 1)];
      renderer.render(this.velocity_scene, this.camera, this.velocity[target_index]);
      target_index = Math.abs(target_index - 1);
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
