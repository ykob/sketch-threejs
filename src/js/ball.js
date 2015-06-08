var Get = require('./get');
var get = new Get();

var exports = function() {
  var Ball = function() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.segments = 24;
    this.geometry;
    this.material;
    this.mesh;
  };

  Ball.prototype.init = function(scene, geometry, material) {
    this.geometry = geometry;
    this.material = material;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.setPosition();
    scene.add(this.mesh);
  };

  Ball.prototype.setPosition = function() {
    this.mesh.position.set(this.x, this.y, this.z);
  };
  
  return Ball;
};

module.exports = exports();
