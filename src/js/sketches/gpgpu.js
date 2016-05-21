var Util = require('../modules/util');
var PhysicsRenderer = require('../modules/physics_renderer');
console.log(PhysicsRenderer);

var exports = function(){
  var Sketch = function(scene, camera) {
    this.init(scene, camera);
  };

  var physics_renderer = new PhysicsRenderer(100);

  Sketch.prototype = {
    init: function(scene, camera) {
      camera.anchor.set(1000, -300, 0);
      camera.look.anchor.set(0, 0, 0);
    },
    remove: function(scene) {
    },
    render: function(scene, camera, renderer) {
      camera.applyHook(0, 0.025);
      camera.applyDrag(0.2);
      camera.updateVelocity();
      camera.updatePosition();
      camera.look.applyHook(0, 0.2);
      camera.look.applyDrag(0.4);
      camera.look.updateVelocity();
      camera.look.updatePosition();
      camera.obj.lookAt(camera.look.position);
    },
    touchStart: function(scene, camera, vector) {
    },
    touchMove: function(scene, camera, vector_mouse_down, vector_mouse_move) {
    },
    touchEnd: function(scene, camera, vector_mouse_end) {
    },
    mouseOut: function(scene, camera) {
    },
    resizeWindow: function(scene, camera) {
    }
  };

  return Sketch;
};

module.exports = exports();
