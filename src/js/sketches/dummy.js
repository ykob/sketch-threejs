var Util = require('../modules/util');
var HemiLight = require('../modules/hemiLight');

var exports = function(){
  var Sketch = function() {
  };
  
  Sketch.prototype = {
    init: function(scene) {
      light = new HemiLight();
      light.init();
      scene.add(light.obj);
      
      var dummy_geometry = new THREE.OctahedronGeometry(80, 2);
      var dummy_material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading
      });
      var dummy_obj = new THREE.Mesh(dummy_geometry, dummy_material);
      scene.add(dummy_obj);
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
