var Util = require('../modules/util');

var exports = function(){
  var Sketch = function() {};

  Sketch.prototype = {
    init: function(scene, camera) {
      var geometry = new THREE.BoxGeometry(100, 100, 100);
      var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.4,
        wireframe: true
      });
      var obj = new THREE.Mesh(geometry, material);
      obj.rotation.set(-0.2, -0.3, 0.3);
      scene.add(obj);
      camera.anchor = new THREE.Vector3(300, 0, 0);
    },
    remove: function(scene) {
    },
    render: function(camera) {
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
