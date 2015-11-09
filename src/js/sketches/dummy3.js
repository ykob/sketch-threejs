var Util = require('../modules/util');
var HemiLight = require('../modules/hemiLight');

var exports = function(){
  var Sketch = function() {
    this.light = null;
    this.mesh = null;
  };
  
  Sketch.prototype = {
    init: function(scene) {
      this.light = new HemiLight();
      this.light.init();
      scene.add(this.light.obj);
      
      var dummy_geometry = new THREE.OctahedronGeometry(80, 2);
      var dummy_material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shading: THREE.FlatShading
      });
      this.mesh = new THREE.Mesh(dummy_geometry, dummy_material);
      scene.add(this.mesh);
    },
    remove: function(scene) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
      scene.remove(this.mesh);
      scene.remove(this.light.obj);
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
