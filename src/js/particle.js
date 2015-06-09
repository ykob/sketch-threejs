var Get = require('./get');
var get = new Get();

var exports = function() {
  var Particle = function() {
    this.size = 1;
    this.scale = 0;
    this.rad1Base = 0;
    this.rad1 = 0;
    this.rad2Base = 0;
    this.rad2 = 0;
    this.r = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotateX = 0;
    this.rotateY = 0;
    this.rotateZ = 0;
    this.geometry;
    this.material;
    this.mesh;
  };

  Particle.prototype.init = function(scene, geometry, material, index, all) {
    this.geometry = geometry;
    this.material = material;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scale = 60;
    this.r = 320;

    this.changeScale();
    this.rad1Base = get.radian(360 * index / all);
    this.rad2Base = get.radian(360 * index / all);
    this.move(index);
    this.setPosition();
    this.setRotation();
    scene.add(this.mesh);
  };

  Particle.prototype.changeScale = function() {
    this.mesh.scale.x = this.scale * this.size;
    this.mesh.scale.y = this.scale * this.size;
    this.mesh.scale.z = this.scale * this.size;
  };

  Particle.prototype.move = function(index) {
    this.rad1 = get.radian(Math.sin(this.rad1Base) * 10);
    this.rad2 = this.rad2Base;
  };

  Particle.prototype.setPosition = function() {
    this.x = Math.cos(this.rad1) * Math.cos(this.rad2) * (this.r);
    this.z = Math.cos(this.rad1) * Math.sin(this.rad2) * (this.r);
    this.y = Math.sin(this.rad1) * (this.r);
    this.mesh.position.set(this.x, this.y, this.z);
  };

  Particle.prototype.setRotation = function() {
    this.rotateX = this.rad1 * 3;
    this.rotateY = this.rad1 * 3;
    this.rotateZ = this.rad1 * 3;
    this.mesh.rotation.set(this.rotateX, this.rotateY, this.rotateZ);
  };
  
  return Particle;
};

module.exports = exports();
