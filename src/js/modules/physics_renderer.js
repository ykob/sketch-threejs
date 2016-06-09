var glslify = require('glslify');

var exports = function(){
  var PhysicsRenderer = function(length) {
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
    this.acceleration_mesh = this.createMesh(
      glslify('../../glsl/physics_renderer.vs'),
      glslify('../../glsl/physics_renderer_acceleration.fs')
    );
    this.velocity_mesh = this.createMesh(
      glslify('../../glsl/physics_renderer.vs'),
      glslify('../../glsl/physics_renderer_velocity.fs')
    );
    this.target_index = 0;
  };
  PhysicsRenderer.prototype = {
    init(renderer, velocity_base) {
      var acceleration_init_mesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(2, 2),
        new THREE.ShaderMaterial({
          vertexShader: 'void main(void) {gl_Position = vec4(position, 1.0);}',
          fragmentShader: 'void main(void) {gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);}',
        })
      );
      var velocity_geometry = new THREE.BufferGeometry();
      var vertices_base = [];
      var uvs_base = [];
      for (var i = 0; i < this.length; i++) {
        vertices_base.push(
          i % Math.sqrt(this.length) * (1 / (Math.sqrt(this.length) - 1)) * 2 - 1,
          Math.floor(i / Math.sqrt(this.length)) * (1 / (Math.sqrt(this.length) - 1)) * 2 - 1,
          0
        );
        uvs_base.push(
          i % length * (1 / (length - 1)),
          Math.floor(i / length) * (1 / (length - 1))
        );
      }
      var vertices = new Float32Array(vertices_base);
      velocity_geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
      var uvs = new Float32Array(uvs_base);
      velocity_geometry.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
      var velocity = new Float32Array(velocity_base);
      velocity_geometry.addAttribute('velocity', new THREE.BufferAttribute(velocity, 3));
      var velocity_init_mesh = new THREE.Mesh(
        velocity_geometry,
        new THREE.ShaderMaterial({
          vertexShader: glslify('../../glsl/physics_renderer_velocity_init.vs'),
          fragmentShader: glslify('../../glsl/physics_renderer_velocity_init.fs'),
        })
      );

      this.acceleration_scene.add(this.camera);
      this.acceleration_scene.add(acceleration_init_mesh);
      renderer.render(this.acceleration_scene, this.camera, this.acceleration[1]);
      this.acceleration_scene.remove(acceleration_init_mesh);
      this.acceleration_scene.add(this.acceleration_mesh);

      this.velocity_scene.add(this.camera);
      this.velocity_scene.add(velocity_init_mesh);
      renderer.render(this.velocity_scene, this.camera, this.velocity[0]);
      renderer.render(this.velocity_scene, this.camera, this.velocity[1]);
      this.velocity_scene.remove(velocity_init_mesh);
      this.velocity_scene.add(this.velocity_mesh);
    },
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
      this.acceleration_mesh.material.uniforms.velocity.value = this.velocity[this.target_index];
      renderer.render(this.acceleration_scene, this.camera, this.acceleration[this.target_index]);
      this.velocity_mesh.material.uniforms.acceleration.value = this.acceleration[this.target_index];
      this.velocity_mesh.material.uniforms.velocity.value = this.velocity[this.target_index];
      renderer.render(this.velocity_scene, this.camera, this.velocity[Math.abs(this.target_index - 1)]);
      this.target_index = Math.abs(this.target_index - 1);
    },
    getCurrentVelocity: function() {
      return this.velocity[Math.abs(this.target_index - 1)];
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
