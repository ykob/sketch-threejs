var Get = require('./get');
var get = new Get();

var exports = function() {
  var Particle = function() {
    this.size = 1;
    this.scale = 0;
    this.rad = 0;
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
    this.scale = get.randomInt(8, 24);
    this.r = 80;
    this.rad = get.radian(360 * index / all);
    this.rad2 = get.radian(360 * index * 10 / all);
    this.changeScale();
    this.changePositionVal();
    this.setPosition();
    this.changeRotationVal();
    this.setRotation();
    scene.add(this.mesh);
  };

  Particle.prototype.changeScale = function() {
    this.mesh.scale.x = this.scale * this.size;
    this.mesh.scale.y = this.scale * this.size;
    this.mesh.scale.z = this.scale * this.size;
  };

  Particle.prototype.changePositionVal = function() {
    this.x = Math.cos(this.rad) * Math.cos(this.rad2) * (this.r);
    this.z = Math.cos(this.rad) * Math.sin(this.rad2) * (this.r);
    this.y = Math.sin(this.rad) * (this.r);
  };

  Particle.prototype.setPosition = function() {
    this.mesh.position.set(this.x, this.y, this.z);
  };

  Particle.prototype.changeRotationVal = function() {
    this.rotateX = this.rad * 3;
    this.rotateY = this.rad * 3;
    this.rotateZ = this.rad * 3;
  };

  Particle.prototype.setRotation = function() {
    this.mesh.rotation.set(this.rotateX, this.rotateY, this.rotateZ);
  };
  
  return Particle;
};

module.exports = exports();
