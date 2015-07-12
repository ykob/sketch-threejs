var Get = require('./get');
var get = new Get();

var exports = function() {
  var Mesh = function() {
    this.r = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.move = {
      cd: 0.3,
      k: 0.2,
      val: [0, 0, 0],
      valBase: [0, 0, 0],
      a: [0, 0, 0],
      v: [0, 0, 0]
    };
    this.expand = {
      cd: 0.2,
      k: 0.4,
      val: 0,
      valBase: 0,
      a: 0,
      v: 0
    };
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
    this.vertexWaveCoe = this.r / 60;

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
      this.vertexDeg[i] = get.randomInt(0, 360);
      r = this.vertexArr[i] + Math.sin(get.radian(this.vertexDeg[i])) * this.vertexWaveCoe;
      vertices[i].normalize().multiplyScalar(r);
    }
    this.comuputeGeometry();
  };
  
  Mesh.prototype.updateVertices = function() {
    var vertices = this.mesh.geometry.vertices;
    this.expand.a = (this.expand.valBase - this.expand.val) * this.expand.k / 2;
    this.expand.a -= this.expand.cd * this.expand.v;
    this.expand.v += this.expand.a;
    this.expand.val += this.expand.v;
    for (var i = 0; i < this.vertexArr.length; i++) {
      var r;
      this.vertexDeg[i] += 8;
      
      r = this.vertexArr[i] + this.expand.val + Math.sin(get.radian(this.vertexDeg[i])) * this.vertexWaveCoe;
      vertices[i].normalize().multiplyScalar(r);
    }
    this.comuputeGeometry();
  };
  
  Mesh.prototype.gliped = function() {
    this.expand.k = 0.03;
    this.expand.cd = 0.4;
    this.expand.valBase = 120;
  };
  
  Mesh.prototype.released = function() {
    this.expand.k = 0.2;
    this.expand.cd = 0.3;
    this.expand.valBase = 0;
  };
  
  Mesh.prototype.updateMoveValBase = function(rad1, rad2, r) {
    this.move.valBase = get.pointSphere(rad1, rad2, r);
    console.log(this.move.valBase);
  };
  
  Mesh.prototype.moveObject = function() {
    for (var i = 0; i < 3; i++) {
      this.move.a[i] = (this.move.valBase[i] - this.move.val[i]) * this.move.k;
      this.move.a[i] -= this.move.cd * this.move.v[i];
      this.move.v[i] += this.move.a[i];
      this.move.val[i] += this.move.v[i];
    }
    this.x = this.move.val[0];
    this.y = this.move.val[1];
    this.z = this.move.val[2];
    this.setPosition();
  };
  
  return Mesh;
};

module.exports = exports();
