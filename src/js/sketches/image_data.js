var Util = require('../modules/util');
var Mover = require('../modules/mover');
var glslify = require('glslify');
var Points = require('../modules/points.js');
var vs = glslify('../sketches/points.vs');
var fs = glslify('../sketches/points.fs');

var exports = function(){
  var Sketch = function() {};
  var image_vertices = [];
  var length_side = 400;
  var points = new Points();
  var created_points = false;

  var getImageData = function(scene) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var image = new Image(); 
    canvas.width = length_side;
    canvas.height = length_side;
    image.src = './img/image_data/elephant.png';
    image.onload = function() {
      ctx.drawImage(image, 0, 0);
      pickedDataNotTransparent(scene, ctx.getImageData(0, 0, length_side, length_side));
    };
  };

  var pickedDataNotTransparent = function(scene, image_data) {
    for (var y = 0; y < length_side; y++) {
      for (var x = 0; x < length_side; x++) {
        if(image_data.data[(x + y * length_side) * 4] > 0) {
          image_vertices.push(0, (y - length_side / 2) * -1, (x - length_side/ 2) * -1);
        }
      }
    }
    buildPoints(scene);
  };

  var buildPoints = function(scene) {
    var positions = new Float32Array(image_vertices);
    var colors = new Float32Array(image_vertices.length);
    var opacities = new Float32Array(image_vertices.length / 3);
    var sizes = new Float32Array(image_vertices.length / 3);
    for (var i = 0; i < image_vertices.length / 3; i++) {
      var color = new THREE.Color('hsl('
                                  + (image_vertices[i * 3 + 2] + image_vertices[i * 3 + 1] + length_side) / 5
                                  + ', 60%, 80%)');
      color.toArray(colors, i * 3);
      opacities[i] = 1;
      sizes[i] = 6;
    }
    points.init({
      scene: scene,
      vs: vs,
      fs: fs,
      positions: positions,
      colors: colors,
      opacities: opacities,
      sizes: sizes,
      texture: createTexture(),
      blending: THREE.NoBlending
    });
    created_points = true;
  };

  var createTexture = function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var grad = null;
    var texture = null;

    canvas.width = 10;
    canvas.height = 10;
    ctx.fillStyle = '#ffffff';
    ctx.rect(0, 0, 10, 10);
    ctx.fill();
    
    texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    return texture;
  };

  Sketch.prototype = {
    init: function(scene, camera) {
      getImageData(scene);
      camera.rad1_base = Util.getRadian(0);
      camera.rad1 = camera.rad1_base;
      camera.rad2 = Util.getRadian(0);
      camera.setPositionSpherical();
    },
    remove: function(scene) {
      
    },
    render: function(scene, camera) {
      if (created_points) points.updatePoints();
      camera.applyHook(0, 0.025);
      camera.applyDrag(0.2);
      camera.updateVelocity();
      camera.updatePosition();
      camera.lookAtCenter();

    },
    touchMove: function(scene, camera, vector_mouse_down, vector_mouse_move) {
      camera.anchor.z = vector_mouse_move.x * 400;
      camera.anchor.y = vector_mouse_move.y * -400;
      //camera.lookAtCenter();
    }
  };

  return Sketch;
};

module.exports = exports();
