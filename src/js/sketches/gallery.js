var Util = require('../modules/util');
var HemiLight = require('../modules/hemiLight');
var Force = require('../modules/force');

var exports = function(){
  var Sketch = function() {};
  var images = [];
  var images_num = 300;
  var hemi_light = new HemiLight();

  var Image = function() {
    this.obj = null;
    Force.call(this);
  };
  var image_geometry = new THREE.PlaneGeometry(100, 100);
  Image.prototype = Object.create(Force.prototype);
  Image.prototype.constructor = Image;
  Image.prototype.init = function(vector) {
    var image_material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide
    });
    this.obj = new THREE.Mesh(image_geometry, image_material);
    this.position = this.obj.position;
    this.velocity = vector.clone();
    this.anchor = vector.clone();
    this.acceleration.set(0, 0, 0);
  };
  Image.prototype.lookAtCenter = function() {
    this.obj.lookAt({
      x: 0,
      y: 0,
      z: 0
    });
  };

  var initImages = function(scene) {
    for (var i = 0; i < images_num; i++) {
      var image = null;
      var rad = Util.getRadian(i % 30 * 12 + 180);
      var radius = 1000;
      var x = Math.cos(rad) * radius;
      var y = i * 6 - images_num * 3;
      var z = Math.sin(rad) * radius;
      var vector = new THREE.Vector3(x, y, z);
      image = new Image();
      image.init(new THREE.Vector3());
      image.anchor.copy(vector);
      scene.add(image.obj);
      images.push(image);
    }
  };

  Sketch.prototype = {
    init: function(scene, camera) {
      initImages(scene);
      hemi_light.init();
      scene.add(hemi_light.obj);
      camera.anchor.set(0, 0, 0);
    },
    remove: function(scene) {
      image_geometry.dispose();
      for (var i = 0; i < images.length; i++) {
        scene.remove(images[i].obj);
      };
      scene.remove(hemi_light.obj);
      images = [];
    },
    render: function(camera) {
      for (var i = 0; i < images_num; i++) {
        images[i].applyHook(0, 0.1);
        images[i].applyDrag(0.3);
        images[i].updateVelocity();
        images[i].updatePosition();
        images[i].obj.lookAt({
          x: 0,
          y: images[i].position.y,
          z: 0
        });
      }
      camera.applyHook(0, 0.025);
      camera.applyDrag(0.2);
      camera.updateVelocity();
      camera.updatePosition();
      camera.obj.lookAt(images[0].position);
    }
  };
  return Sketch;
};

module.exports = exports();
