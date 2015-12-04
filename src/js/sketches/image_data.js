var THREE = require('three');
var Util = require('../modules/util');
var Mover = require('../modules/mover');
var glslify = require('glslify');
var vs = glslify('../sketches/points.vs');
var fs = glslify('../sketches/points.fs');

var exports = function(){
  var Sketch = function() {};

  Sketch.prototype = {
    init: function(scene, camera) {

    },
    remove: function(scene) {
      
    },
    render: function(scene, camera) {
      camera.applyHook(0, 0.025);
      camera.applyDrag(0.2);
      camera.updateVelocity();
      camera.updatePosition();
      camera.lookAtCenter();
    }
  };

  return Sketch;
};

module.exports = exports();
