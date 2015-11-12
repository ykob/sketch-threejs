var Util = require('../modules/util');
var Mover = require('../modules/mover');
var Points = require('../modules/points.js');
var Light = require('../modules/pointLight');
var glslify = require('glslify');
var vs = glslify('../sketches/hyper_space.vs');
var fs = glslify('../sketches/hyper_space.fs');

var exports = function(){
  var Sketch = function() {
    this.movers_num = 10000;
    this.movers = [];
    this.points = new Points();
    this.light = new Light();
    this.positions = new Float32Array(this.movers_num * 3);
    this.colors = new Float32Array(this.movers_num * 3);
    this.opacities = new Float32Array(this.movers_num);
    this.sizes = new Float32Array(this.movers_num);
    this.gravity = new THREE.Vector3(0, -0.1, 0);
    this.last_time_activate = Date.now();
  };
  
  Sketch.prototype = {
    init: function(scene) {
      for (var i = 0; i < this.movers_num; i++) {
        var mover = new Mover();
        var h = Util.getRandomInt(0, 90);
        var s = Util.getRandomInt(60, 90);
        var color = new THREE.Color('hsl(' + h + ', ' + s + '%, 50%)');

        mover.init(new THREE.Vector3(Util.getRandomInt(-100, 100), 0, 0));
        this.movers.push(mover);
        this.positions[i * 3 + 0] = mover.position.x;
        this.positions[i * 3 + 1] = mover.position.y;
        this.positions[i * 3 + 2] = mover.position.z;
        color.toArray(this.colors, i * 3);
        this.opacities[i] = mover.a;
        this.sizes[i] = mover.size;
      }
      this.points.init({
        scene: scene,
        vs: vs,
        fs: fs,
        positions: this.positions,
        colors: this.colors,
        opacities: this.opacities,
        sizes: this.sizes,
        texture: this.createTexture()
      });
      this.light.init();
      scene.add(this.light.obj);
    },
    remove: function(scene) {
      this.points.geometry.dispose();
      this.points.material.dispose();
      scene.remove(this.points.obj);
      scene.remove(this.light.obj);
    },
    render: function(camera) {
      this.activateMover();
      this.updateMover();
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
      this.points.updatePoints();
    },
    activateMover: function() {
      var count = 0;
      var now = Date.now();
      if (now - this.last_time_activate > 100) {
        for (var i = 0; i < this.movers.length; i++) {
          var mover = this.movers[i];
          if (mover.is_active) continue;
          var rad1 = Util.getRadian(Util.getRandomInt(0, 360));
          var rad2 = Util.getRadian(Util.getRandomInt(0, 360));
          var range = (1 - Math.log(Util.getRandomInt(2, 64)) / Math.log(64)) * 80;
          var vector = Util.getSpherical(rad1, rad2, range);
          var force = Util.getSpherical(rad1, rad2, range / 8);
          vector.add(this.points.obj.position);
          mover.activate();
          mover.init(vector);
          mover.applyForce(force);
          mover.a = 0.6;
          mover.size = Util.getRandomInt(20, 80);
          count++;
          if (count >= 50) break;
        }
        this.last_time_activate = Date.now();
      }
    },
    updatePoints: function() {
      this.points.updateVelocity();
      this.points.updatePosition();
      this.light.obj.position.copy(this.points.velocity);
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
