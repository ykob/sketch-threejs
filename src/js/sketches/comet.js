var Util = require('../modules/util');
var Mover = require('../modules/mover');
var Points = require('../modules/points.js');
var HemiLight = require('../modules/hemiLight');
var PointLight = require('../modules/pointLight');
var glslify = require('glslify');
var vs = glslify('../sketches/points.vs');
var fs = glslify('../sketches/points.fs');

var exports = function(){
  var Sketch = function() {};
  var movers_num = 10000;
  var movers = [];
  var points = new Points();
  var hemi_light = new HemiLight();
  var point_light = new PointLight();
  var positions = new Float32Array(movers_num * 3);
  var colors = new Float32Array(movers_num * 3);
  var opacities = new Float32Array(movers_num);
  var sizes = new Float32Array(movers_num);
  var commet = null;
  var last_time_activate = Date.now();

  var createCommet = function() {
    var geometry = new THREE.OctahedronGeometry(50, 2);
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading
    });
    return new THREE.Mesh(geometry, material);
  };

  var updateMover = function() {
    for (var i = 0; i < movers.length; i++) {
      var mover = movers[i];
      var position = new THREE.Vector3();
      if (mover.is_active) {
        mover.time++;
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
      positions[i * 3 + 0] = mover.position.x - points.obj.position.x;
      positions[i * 3 + 1] = mover.position.y - points.obj.position.y;
      positions[i * 3 + 2] = mover.position.z - points.obj.position.z;
      opacities[i] = mover.a;
      sizes[i] = mover.size;
    }
    points.updatePoints();
  };

  var activateMover = function() {
    var count = 0;
    var now = Date.now();
    if (now - last_time_activate > 10) {
      for (var i = 0; i < movers.length; i++) {
        var mover = movers[i];
        if (mover.is_active) continue;
        var rad1 = Util.getRadian(Util.getRandomInt(0, 360));
        var rad2 = Util.getRadian(Util.getRandomInt(0, 360));
        var range = (1 - Math.log(Util.getRandomInt(1, 32)) / Math.log(64)) * 50;
        var vector = Util.getSpherical(rad1, rad2, range);
        var force = Util.getSpherical(rad1, rad2, range / 20);
        vector.add(points.obj.position);
        mover.activate();
        mover.init(vector);
        mover.applyForce(force);
        mover.a = 0.6;
        mover.size = Util.getRandomInt(10, 40);
        count++;
        if (count >= 50) break;
      }
      last_time_activate = Date.now();
    }
  };

  var updatePoints = function(camera) {
    points.hook(0, 0.001);
    points.updateVelocity();
    points.updatePosition();
    commet.position.copy(points.obj.position);
    point_light.obj.position.copy(points.velocity);
  };

  var createTexture = function() {
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
  };

  Sketch.prototype = {
    init: function(scene) {
      commet = createCommet();
      scene.add(commet);
      for (var i = 0; i < movers_num; i++) {
        var mover = new Mover();
        var h = Util.getRandomInt(0, 90);
        var s = Util.getRandomInt(60, 90);
        var color = new THREE.Color('hsl(' + h + ', ' + s + '%, 50%)');

        mover.init(new THREE.Vector3(Util.getRandomInt(-100, 100), 0, 0));
        movers.push(mover);
        positions[i * 3 + 0] = mover.position.x;
        positions[i * 3 + 1] = mover.position.y;
        positions[i * 3 + 2] = mover.position.z;
        color.toArray(colors, i * 3);
        opacities[i] = mover.a;
        sizes[i] = mover.size;
      }
      points.init({
        scene: scene,
        vs: vs,
        fs: fs,
        positions: positions,
        colors: colors,
        opacities: opacities,
        sizes: sizes,
        texture: createTexture()
      });
      hemi_light.init();
      scene.add(hemi_light.obj);
      point_light.init();
      scene.add(point_light.obj);
      points.applyForce(new THREE.Vector3(10, 10, 10));
    },
    remove: function(scene) {
      points.geometry.dispose();
      points.material.dispose();
      scene.remove(points.obj);
      scene.remove(point_light.obj);
      movers = [];
    },
    render: function(camera) {
      updatePoints(camera);
      activateMover();
      updateMover();
      camera.hook(0, 0.004);
      camera.applyDragForce(0.1);
      camera.updateVelocity();
      camera.updatePosition();
      camera.lookAtCenter();
      //camera.obj.lookAt(points.obj.position);
    }
  };

  return Sketch;
};

module.exports = exports();
