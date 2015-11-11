var Util = require('../modules/util');
var Mover = require('../modules/mover');
var Points = require('../modules/points.js');
var Light = require('../modules/pointLight');
var glslify = require('glslify');
var vs = glslify('../sketches/points.vs');
var fs = glslify('../sketches/points.fs');

var exports = function(){
  var Sketch = function() {
    this.points = null;
    this.movers_num = 10000;
    this.movers = [];
    this.gravity = new THREE.Vector3(0, -0.1, 0);
    this.light = new Light();
  };
  
  Sketch.prototype = {
    init: function(scene) {
      this.points = new Points();
      this.points.init(scene);
    },
    remove: function(scene) {
      this.points.geometry.dispose();
      this.points.material.dispose();
      scene.remove(this.points);
    },
    render: function(camera) {
      camera.hook(0, 0.004);
      camera.applyDragForce(0.1);
      camera.updateVelocity();
      camera.updatePosition();
      camera.lookAtCenter();
    },
    updateMover: function() {
      for (var i = 0; i < this.movers.length; i++) {
        var mover = this.movers[i];

        if (mover.is_active) {
          mover.time++;
          mover.applyForce(this.gravity);
          mover.applyDragForce(0.1);
          mover.updateVelocity();
          mover.updatePosition();
          if (mover.time > 10) {
            mover.size -= 2;
            mover.a -= 0.02;
          }
          if (mover.a <= 0) {
            mover.init(new THREE.Vector3(0, 0, 0));
            mover.time = 0;
            mover.a = 0.0;
            mover.inactivate();
          }
        }
        this.positions[i * 3 + 0] = mover.position.x;
        this.positions[i * 3 + 1] = mover.position.y;
        this.positions[i * 3 + 2] = mover.position.z;
        this.opacities[i] = mover.a;
        this.sizes[i] = mover.size;
      }
    },
    activateMover: function() {
      var count = 0;

      for (var i = 0; i < this.movers.length; i++) {
        var mover = this.movers[i];
        if (mover.is_active) continue;
        var rad1 = Util.getRadian(Util.getRandomInt(0, 360));
        var rad2 = Util.getRadian(Util.getRandomInt(0, 360));
        var range = (1 - Math.log(Util.getRandomInt(2, 64)) / Math.log(64)) * 80;
        var vector = Util.getSpherical(rad1, rad2, range);
        var force = Util.getSpherical(rad1, rad2, range / 8);
        vector.add(this.position);
        mover.activate();
        mover.init(vector);
        mover.applyForce(force);
        mover.a = 0.6;
        mover.size = Util.getRandomInt(20, 80);
        count++;
        if (count >= 60) break;
      }
    },
    createTexture: function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var grad = null;
      var texture = null;

      canvas.width = 200;
      canvas.height = 200;
      grad = ctx.createRadialGradient(100, 100, 20, 100, 100, 100);
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.arc(100, 100, 100, 0, Math.PI / 180, true);
      ctx.fill();
      
      texture = new THREE.Texture(canvas);
      texture.minFilter = THREE.NearestFilter;
      texture.needsUpdate = true;
      return texture;
    }
  };

  return Sketch;
};

module.exports = exports();
