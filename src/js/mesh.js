var Get = require('./get');
var get = new Get();

var exports = function() {
  var Mesh = function() {
    this.r = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.geometry;
    this.material;
    this.mesh;
    this.vertexArr = [];
    this.vertexDeg = [];
    this.vertexWaveCoe = 0;
  };

  Mesh.prototype.init = function(scene, geometry, material) {
    this.geometry = geometry;
    this.material = material;
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.r = this.geometry.parameters.radius;
    this.vertexWaveCoe = this.r / 30;

    this.geometry.mergeVertices();
    this.updateVerticesInt();
    this.setPosition();
    
    scene.add(this.mesh);
  };

  Mesh.prototype.setPosition = function() {
    this.mesh.position.set(this.x, this.y, this.z);
  };
  
  Mesh.prototype.comuputeGeometry = function() {
    this.mesh.geometry.computeVertexNormals();
    this.mesh.geometry.computeFaceNormals();
    this.mesh.geometry.verticesNeedUpdate = true;
    this.mesh.geometry.elementsNeedUpdate = true;
    this.mesh.geometry.normalsNeedUpdate = true;
  };
  
  Mesh.prototype.updateVerticesInt = function() {
    var vertices = this.mesh.geometry.vertices;
    for (var i = 0; i < vertices.length; i++) {
      var r = this.r;
      this.vertexArr[i] = r;
      this.vertexDeg[i] = get.randomInt(0, 360);
      vertices[i].normalize().multiplyScalar(r);
    }
    this.comuputeGeometry();
  };
  
  Mesh.prototype.updateVertices = function() {
    var vertices = this.mesh.geometry.vertices;
    for (var i = 0; i < this.vertexArr.length; i++) {
      var r;
      this.vertexDeg[i] += 8;
      r = this.vertexArr[i] + Math.sin(get.radian(this.vertexDeg[i])) * this.vertexWaveCoe;
      vertices[i].normalize().multiplyScalar(r);
    }
    this.comuputeGeometry();
  };
  
  return Mesh;
};

module.exports = exports();
