var Util = require('./util');
var Mover = require('./mover');

var exports = function(){
  var Points = function() {
    this.movers_num = 10000;
    this.movers = [];
    this.geometry = null;
    this.material = null;
    this.obj = null;
    this.texture = null;
    this.antigravity = new THREE.Vector3(0, 30, 0);
  };
  
  Points.prototype = {
    init: function() {
      this.createTexture();
      this.geometry = new THREE.Geometry();
      this.material = new THREE.PointsMaterial({
        color: 0xffff99,
        size: 20,
        transparent: true,
        opacity: 0.6,
        map: this.texture,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      });
      for (var i = 0; i < this.movers_num; i++) {
        var mover = new Mover();
        var range = Math.log(Util.getRandomInt(2, 256)) / Math.log(256) * 250 + 50;
        var rad = Util.getRadian(Util.getRandomInt(0, 180) * 2);
        var x = Math.cos(rad) * range;
        var z = Math.sin(rad) * range;

        mover.init(new THREE.Vector3(x, 1000, z));
        mover.mass = Util.getRandomInt(200, 500) / 100;
        this.movers.push(mover);
        this.geometry.vertices.push(mover.position);
      }
      this.obj = new THREE.Points(this.geometry, this.material);
    },
    update: function() {
      var points_vertices = [];

      for (var i = 0; i < this.movers.length; i++) {
        var mover = this.movers[i];
        if (mover.is_active) {
          mover.applyForce(this.antigravity);
          mover.updateVelocity();
          mover.updatePosition();
          if (mover.position.y > 1000) {
            var range = Math.log(Util.getRandomInt(2, 256)) / Math.log(256) * 250 + 50;
            var rad = Util.getRadian(Util.getRandomInt(0, 180) * 2);
            var x = Math.cos(rad) * range;
            var z = Math.sin(rad) * range;

            mover.init(new THREE.Vector3(x, -300, z));
            mover.mass = Util.getRandomInt(200, 500) / 100;
          }
        }
        points_vertices.push(mover.position);
      }
      this.obj.geometry.vertices = points_vertices;
      this.obj.geometry.verticesNeedUpdate = true;
    },
    activateMover: function() {
      var count = 0;

      for (var i = 0; i < this.movers.length; i++) {
        var mover = this.movers[i];
        
        if (mover.is_active) continue;
        mover.activate();
        mover.velocity.y = -300;
        count++;
        if (count >= 50) break;
      }
    },
    createTexture: function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var grad = null;

      canvas.width = 200;
      canvas.height = 200;
      grad = ctx.createRadialGradient(100, 100, 20, 100, 100, 100);
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.arc(100, 100, 100, 0, Math.PI / 180, true);
      ctx.fill();
      this.texture = new THREE.Texture(canvas);
      this.texture.minFilter = THREE.NearestFilter;
      this.texture.needsUpdate = true;
    }
  };

  return Points;
};

module.exports = exports();
