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
    this.updateVertices();
    scene.add(this.mesh);
    console.log(this.mesh.geometry);
  };

  Ball.prototype.setPosition = function() {
    this.mesh.position.set(this.x, this.y, this.z);
  };
  
  Ball.prototype.updateVertices = function() {
    var vertices = this.mesh.geometry.vertices;
    // for (var i = 0; i < vertices.length; i++) {
    //   vertices[i].normalize().multiplyScalar(get.randomInt(200, 210));
    // }
    this.mesh.geometry.mergeVertices();
    this.mesh.geometry.verticesNeedUpdate = true;
  };
  
  return Ball;
};

module.exports = exports();
