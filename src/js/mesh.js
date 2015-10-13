var Util = require('./util');

var exports = function() {
  var Mesh = function() {
    this.id = 0;
    this.position = [0, 0, 0];
    this.geometry;
    this.material;
    this.mesh;
  };

  Mesh.prototype.init = function(scene, geometry, material) {
    this.geometry = geometry;
    this.material = material;
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.id = this.mesh.id;
    this.setPosition();
  };

  Mesh.prototype.setPosition = function() {
    this.mesh.position.set(this.position[0], this.position[1], this.position[2]);
  };
  
  return Mesh;
};

module.exports = exports();
