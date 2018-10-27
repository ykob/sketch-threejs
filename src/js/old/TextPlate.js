const THREE = require('three');
const Util = require('./util');
const Force3 = require('./Force3');

var exports = function(){
  var TextPlate = function() {
    this.geometry = null;
    this.material = null;
    this.obj;
    this.texture = null;
    Force3.call(this);
  };
  TextPlate.prototype = Object.create(Force3.prototype);
  TextPlate.prototype.constructor = TextPlate;
  TextPlate.prototype.init = function() {
    this.createTexture();
    this.geometry = new THREE.PlaneGeometry(300, 300, 32);
    this.material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      map: this.texture,
      transparent: true
    });
    this.obj = new THREE.Mesh(this.geometry, this.material);
    this.obj.position.y = 200;
    this.obj.rotation.set(Util.getRadian(-90), 0, Util.getRadian(90));
  },
  TextPlate.prototype.rotate = function() {
    this.obj.rotation.x += 0.001;
    this.obj.rotation.y += 0.002;
    this.obj.rotation.z += 0.001;
  },
  TextPlate.prototype.createTexture = function() {
    var str = 'three.js Points';
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    canvas.width = 1000;
    canvas.height = 1000;
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.font = 'bold 80px "source code pro"';
    ctx.textAlign = "center";
    ctx.fillText(str, 500, 500);
    ctx.fill();
    this.texture = new THREE.Texture(canvas);
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.needsUpdate = true;
  };

  return TextPlate;
};

module.exports = exports();
