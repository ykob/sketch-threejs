var Get = require('./get');
var get = new Get();

var exports = function() {
  var Mesh = function() {
    this.r = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.cd = 0.2;
    this.k  = 0.4;
    this.val  = 0;
    this.valBase = this.val;
    this.a = 0;
    this.v = 0;
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
    this.vertexWaveCoe = this.r / 5;

    this.geometry.mergeVertices();
    this.updateVerticesInt();
    this.setPosition();
    
    scene.add(this.mesh);
    this.id = this.mesh.id;
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
      this.vertexDeg[i] = vertices[i].y;
      r = this.vertexArr[i] + Math.sin(get.radian(this.vertexDeg[i])) * this.vertexWaveCoe;
      vertices[i].normalize().multiplyScalar(r);
    }
    this.comuputeGeometry();
  };
  
  Mesh.prototype.updateVertices = function() {
    var vertices = this.mesh.geometry.vertices;
    this.a = (this.valBase - this.val) * this.k;
    this.a -= this.cd * this.v;
    this.v += this.a;
    this.val += this.v;
    for (var i = 0; i < this.vertexArr.length; i++) {
      var r;
      this.vertexDeg[i] += 8;
      
      r = this.vertexArr[i] + this.val + Math.sin(get.radian(this.vertexDeg[i])) * this.vertexWaveCoe;
      vertices[i].normalize().multiplyScalar(r);
    }
    this.comuputeGeometry();
  };
  
  Mesh.prototype.gliped = function() {
    this.k = 0.03;
    this.cd = 0.4;
    this.valBase = 240;
  };
  
  Mesh.prototype.released = function() {
    this.k = 0.25;
    this.cd = 0.35;
    this.valBase = 0;
  };
  
  return Mesh;
};

module.exports = exports();
