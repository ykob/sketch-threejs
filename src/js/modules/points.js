var Util = require('../modules/util');
var Mover = require('../modules/mover');
var Light = require('../modules/pointLight');

var exports = function(){
  var Points = function() {
    this.geometry = new THREE.BufferGeometry();
    this.material = null;
    this.obj = null;
    this.positions = new Float32Array(this.movers_num * 3);
    this.colors = new Float32Array(this.movers_num * 3);
    this.opacities = new Float32Array(this.movers_num);
    this.sizes = new Float32Array(this.movers_num);
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
  };
  
  Points.prototype = {
    init: function(scene) {
      // this.createTexture();
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          color: { type: 'c', value: new THREE.Color(0xffffff) },
          texture: { type: 't', value: texture }
        },
        vertexShader: vs,
        fragmentShader: fs,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      // for (var i = 0; i < this.movers_num; i++) {
      //   var mover = new Mover();
      //   var h = Util.getRandomInt(0, 90);
      //   var s = Util.getRandomInt(60, 90);
      //   var color = new THREE.Color('hsl(' + h + ', ' + s + '%, 50%)');

      //   mover.init(new THREE.Vector3(0, 0, 0));
      //   this.movers.push(mover);
      //   this.positions[i * 3 + 0] = mover.position.x;
      //   this.positions[i * 3 + 1] = mover.position.y;
      //   this.positions[i * 3 + 2] = mover.position.z;
      //   color.toArray(this.colors, i * 3);
      //   this.opacities[i] = mover.a;
      //   this.sizes[i] = mover.size;
      // }
      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
      this.geometry.addAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));
      this.geometry.addAttribute('vertexOpacity', new THREE.BufferAttribute(this.opacities, 1));
      this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
      this.obj = new THREE.Points(this.geometry, this.material);
      scene.add(this.obj);
      // this.light.init();
      // scene.add(this.light.obj);
    },
    updateVelocity: function() {
      this.velocity.add(this.acceleration);
    },
    updatePosition: function() {
      this.position.copy(this.velocity);
      // this.light.obj.position.copy(this.velocity);
    },
    updatePoints: function() {
      // this.updateMover();
      this.obj.geometry.position = this.positions;
      this.obj.geometry.vertexOpacity = this.opacities;
      this.obj.geometry.size = this.sizes;
      this.obj.geometry.attributes.position.needsUpdate = true;
      this.obj.geometry.attributes.vertexOpacity.needsUpdate = true;
      this.obj.geometry.attributes.size.needsUpdate = true;
    }
  };

  return Points;
};

module.exports = exports();
