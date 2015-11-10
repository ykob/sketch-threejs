var Util = require('../modules/util');
var Points = require('../modules/points.js');

var exports = function(){
  var Sketch = function() {
    this.points = null;
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
    }
  };

  return Sketch;
};

module.exports = exports();
