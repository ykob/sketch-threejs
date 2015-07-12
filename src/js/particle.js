var Get = require('./get');
var get = new Get();

var exports = function() {
  var Particle = function() {
    this.size = 1;
    this.scale = get.randomInt(16, 32);
    this.rad1Base = 0;
    this.rad1 = 0;
    this.rad2Base = 0;
    this.rad2 = 0;
    this.rBase = get.randomInt(150, 180);
    this.r = this.rBase;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.m = 1;
    this.move = {
      cd: 0.5,
      k: 0.1,
      val: [0, 0, 0],
      valBase: [0, 0, 0],
      a: [0, 0, 0],
      v: [0, 0, 0]
    };
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
    this.m = index / 5 + 1;

    this.changeScale();
    this.rad1Base = get.radian(get.randomInt(0, 360));
    this.rad2Base = get.radian(get.randomInt(0, 360));
    this.setPosition();
    this.setRotation();
    scene.add(this.mesh);
  };

  Particle.prototype.setPosition = function() {
    var points = get.pointSphere(this.rad1, this.rad2, this.r);
    this.mesh.position.set(points[0] + this.move.val[0], points[1] + this.move.val[1], points[2] + this.move.val[2]);
  };

  Particle.prototype.setRotation = function() {
    this.rotateX = this.rad1 * 3;
    this.rotateY = this.rad1 * 3;
    this.rotateZ = this.rad1 * 3;
    this.mesh.rotation.set(this.rotateX, this.rotateY, this.rotateZ);
  };
  
  Particle.prototype.changeScale = function() {
    this.mesh.scale.x = this.scale * this.size;
    this.mesh.scale.y = this.scale * this.size;
    this.mesh.scale.z = this.scale * this.size;
  };

  Particle.prototype.moveObject = function(valBase) {
    this.move.valBase = valBase;
    this.rad1Base += get.radian(2);
    this.rad2Base += get.radian(1);
    for (var i = 0; i < 3; i++) {
      this.move.a[i] = (this.move.valBase[i] - this.move.val[i]) * this.move.k / this.m;
      this.move.a[i] -= this.move.cd * this.move.v[i];
      this.move.v[i] += this.move.a[i];
      this.move.val[i] += this.move.v[i];
    }
    this.rad1 = get.radian(Math.sin(this.rad1Base) * 40);
    this.rad2 = this.rad2Base;
    this.setPosition();
    this.setRotation();
  };
  
  return Particle;
};

module.exports = exports();
