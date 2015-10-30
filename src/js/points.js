var Util = require('./util');
var Mover = require('./mover');

var exports = function(){
  var Points = function() {
    this.movers_num = 20000;
    this.movers = [];
    this.geometry = null;
    this.material = null;
    this.obj = null;
    this.texture = null;
    this.positions = new Float32Array(this.movers_num * 3);
    this.colors = new Float32Array(this.movers_num * 3);
    this.opacities = new Float32Array(this.movers_num);
    this.sizes = new Float32Array(this.movers_num);
    this.anti_gravity = new THREE.Vector3(0, 0.004, 0);
  };
  
  Points.prototype = {
    init: function() {
      this.createTexture();
      this.geometry = new THREE.BufferGeometry();
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          color: {
            type: 'c',
            value: new THREE.Color(0xffffff)
          },
          texture: {
            type: 't',
            value: this.texture
          }
        },
        vertexShader: document.getElementById('vertex-shader').textContent,
        fragmentShader: document.getElementById('fragment-shader').textContent,
        transparent: true,
        depthTest: false,
        blending: THREE.AdditiveBlending
      });
      for (var i = 0; i < this.movers_num; i++) {
        var mover = new Mover();
        var h = Util.getRandomInt(0, 80);
        var s = Util.getRandomInt(20, 80);
        var color = new THREE.Color('hsl(' + h + ', ' + s + '%, 50%)');

        mover.init(new THREE.Vector3(0, 0, 0));
        mover.a = 0.0;
        this.movers.push(mover);
        this.positions[i * 3 + 0] = mover.position.x;
        this.positions[i * 3 + 1] = mover.position.y;
        this.positions[i * 3 + 2] = mover.position.z;
        color.toArray(this.colors, i * 3);
        this.opacities[i] = mover.a;
        this.sizes[i] = Util.getRandomInt(10, 60);
      }
      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
      this.geometry.addAttribute('customColor', new THREE.BufferAttribute(this.colors, 3));
      this.geometry.addAttribute('vertexOpacity', new THREE.BufferAttribute(this.opacities, 1));
      this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
      this.obj = new THREE.Points(this.geometry, this.material);
    },
    update: function() {
      for (var i = 0; i < this.movers.length; i++) {
        var mover = this.movers[i];
        if (mover.is_active) {
          mover.time++;
          mover.applyForce(this.anti_gravity);
          mover.updateVelocity();
          mover.updatePosition();
          if (mover.time > 300) mover.a -= 0.01;
          if (mover.time > 500) {
            mover.time = 0;
            mover.init(new THREE.Vector3(0, 0, 0));
            mover.a = 0.0;
            mover.inactivate();
          }
        }
        this.positions[i * 3 + 0] = mover.position.x;
        this.positions[i * 3 + 1] = mover.position.y;
        this.positions[i * 3 + 2] = mover.position.z;
        this.opacities[i] = mover.a;
      }
      this.obj.geometry.position = this.positions;
      this.obj.geometry.vertexOpacity = this.opacities;
      this.obj.geometry.attributes.position.needsUpdate = true;
      this.obj.geometry.attributes.vertexOpacity.needsUpdate = true;
    },
    activateMover: function() {
      var count = 0;

      for (var i = 0; i < this.movers.length; i++) {
        var mover = this.movers[i];
        if (mover.is_active) continue;
        var rad = Util.getRadian(Util.getRandomInt(0, 36000)/ 100);
        var range = Math.log(Util.getRandomInt(2400, 128000) / 1000) / Math.log(128) * 400;
        var x = Math.cos(rad) * range;
        var z = Math.sin(rad) * range;
        mover.activate();
        mover.init(new THREE.Vector3(x, -150, z));
        mover.a = 0.3;
        count++;
        if (count >= 50) break;
      }
    },
    createTexture: function() {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var grad = null;

      canvas.width = 200;
      canvas.height = 200;
      grad = ctx.createRadialGradient(100, 100, 20, 100, 100, 100);
      grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
      grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.arc(100, 100, 100, 0, Math.PI / 180, true);
      ctx.fill();
      this.texture = new THREE.Texture(canvas);
      this.texture.minFilter = THREE.NearestFilter;
      this.texture.needsUpdate = true;
    }
  };

  return Points;
};

module.exports = exports();
