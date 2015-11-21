(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Util = require('../modules/util');
var Force = require('../modules/force');

var exports = function(){
  var Camera = function() {
    this.rad1_base = Util.getRadian(10);
    this.rad1 = this.rad1_base;
    this.rad2 = Util.getRadian(0);
    this.range = 1000;
    this.obj;
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
    this.mass = 1;
  };
  
  Camera.prototype = {
    init: function(width, height) {
      this.obj = new THREE.PerspectiveCamera(35, width / height, 1, 10000);
      this.obj.up.set(0, 1, 0);
      this.setPositionSpherical();
      this.velocity.copy(this.anchor);
      this.lookAtCenter();
    },
    reset: function() {
      this.setPositionSpherical();
      this.lookAtCenter();
    },
    resize: function(width, height) {
      this.obj.aspect = width / height;
      this.obj.updateProjectionMatrix();
    },
    setPositionSpherical: function() {
      var points = Util.getSpherical(this.rad1, this.rad2, this.range);
      this.anchor.copy(points);
    },
    updatePosition: function() {
      this.obj.position.copy(this.velocity);
    },
    updateVelocity: function() {
      this.acceleration.divideScalar(this.mass);
      this.velocity.add(this.acceleration);
    },
    applyForce: function(vector) {
      this.acceleration.add(vector);
    },
    applyFriction: function() {
      var friction = Force.friction(this.acceleration, 0.1);
      this.applyForce(friction);
    },
    applyDragForce: function(value) {
      var drag = Force.drag(this.acceleration, value);
      this.applyForce(drag);
    },
    hook: function(rest_length, k) {
      var force = Force.hook(this.velocity, this.anchor, rest_length, k);
      this.applyForce(force);
    },
    rotate: function() {
      this.rad1_base += Util.getRadian(0.25);
      this.rad1 = Util.getRadian(Math.sin(this.rad1_base) * 80);
      this.rad2 += Util.getRadian(0.5);
      this.reset();
    },
    lookAtCenter: function() {
      this.obj.lookAt({
        x: 0,
        y: 0,
        z: 0
      });
    },
  };

  return Camera;
};

module.exports = exports();

},{"../modules/force":3,"../modules/util":7}],2:[function(require,module,exports){
module.exports = function(object, eventType, callback){
  var timer;

  object.addEventListener(eventType, function(event) {
    clearTimeout(timer);
    timer = setTimeout(function(){
      callback(event);
    }, 500);
  }, false);
};

},{}],3:[function(require,module,exports){
var exports = {
  friction: function(acceleration, mu, normal, mass) {
    var force = acceleration.clone();
    if (!normal) normal = 1;
    if (!mass) mass = 1;
    force.multiplyScalar(-1);
    force.normalize();
    force.multiplyScalar(mu);
    return force;
  },
  drag: function(acceleration, value) {
    var force = acceleration.clone();
    force.multiplyScalar(-1);
    force.normalize();
    force.multiplyScalar(acceleration.length() * value);
    return force;
  },
  hook: function(velocity, anchor, rest_length, k) {
    var force = velocity.clone().sub(anchor);
    var distance = force.length() - rest_length;
    force.normalize();
    force.multiplyScalar(-1 * k * distance);
    return force;
  }
};

module.exports = exports;

},{}],4:[function(require,module,exports){
var Util = require('../modules/util');
var Force = require('../modules/force');

var exports = function(){
  var Mover = function() {
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
    this.mass = 1;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.size = 0;
    this.time = 0;
    this.is_active = false;
  };
  
  Mover.prototype = {
    init: function(vector) {
      this.position = vector.clone();
      this.velocity = vector.clone();
      this.anchor = vector.clone();
      this.acceleration.set(0, 0, 0);
      this.a = 0;
      this.time = 0;
    },
    updatePosition: function() {
      this.position.copy(this.velocity);
    },
    updateVelocity: function() {
      this.acceleration.divideScalar(this.mass);
      this.velocity.add(this.acceleration);
      // if (this.velocity.distanceTo(this.position) >= 1) {
      //   this.direct(this.velocity);
      // }
    },
    applyForce: function(vector) {
      this.acceleration.add(vector);
    },
    applyFriction: function() {
      var friction = Force.friction(this.acceleration, 0.1);
      this.applyForce(friction);
    },
    applyDragForce: function(value) {
      var drag = Force.drag(this.acceleration, value);
      this.applyForce(drag);
    },
    hook: function(rest_length, k) {
      var force = Force.hook(this.velocity, this.anchor, rest_length, k);
      this.applyForce(force);
    },
    activate: function () {
      this.is_active = true;
    },
    inactivate: function () {
      this.is_active = false;
    }
  };

  return Mover;
};

module.exports = exports();

},{"../modules/force":3,"../modules/util":7}],5:[function(require,module,exports){
var Util = require('../modules/util');
var Force = require('../modules/force');

var exports = function(){
  var PointLight = function() {
    this.rad1 = Util.getRadian(0);
    this.rad2 = Util.getRadian(0);
    this.range = 200;
    this.hex = 0xffffff;
    this.intensity = 1;
    this.distance = 2000;
    this.decay = 1;
    this.obj;
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
    this.mass = 1;
  };
  
  PointLight.prototype = {
    init: function(hex, distance) {
      if (hex) this.hex = hex;
      if (distance) this.distance = distance;
      this.obj = new THREE.PointLight(this.hex, this.intensity, this.distance, this.decay);
      this.setPositionSpherical();
    },
    setPositionSpherical: function() {
      var points = Util.getSpherical(this.rad1, this.rad2, this.range);
      this.obj.position.copy(points);
    },
    updatePosition: function() {
      this.obj.position.copy(this.velocity);
    },
    updateVelocity: function() {
      this.acceleration.divideScalar(this.mass);
      this.velocity.add(this.acceleration);
    },
    applyForce: function(vector) {
      this.acceleration.add(vector);
    },
    applyFriction: function() {
      var friction = Force.friction(this.acceleration, 0.1);
      this.applyForce(friction);
    },
    applyDragForce: function(value) {
      var drag = Force.drag(this.acceleration, value);
      this.applyForce(drag);
    },
    hook: function(rest_length, k) {
      var force = Force.hook(this.velocity, this.anchor, rest_length, k);
      this.applyForce(force);
    },
  };
  
  return PointLight;
};

module.exports = exports();

},{"../modules/force":3,"../modules/util":7}],6:[function(require,module,exports){
var Util = require('../modules/util');
var Force = require('../modules/force');

var exports = function(){
  var Points = function() {
    this.geometry = new THREE.BufferGeometry();
    this.material = null;
    this.obj = null;
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
    this.mass = 1;
  };
  
  Points.prototype = {
    init: function(param) {
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          color: { type: 'c', value: new THREE.Color(0xffffff) },
          texture: { type: 't', value: param.texture }
        },
        vertexShader: param.vs,
        fragmentShader: param.fs,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      this.geometry.addAttribute('position', new THREE.BufferAttribute(param.positions, 3));
      this.geometry.addAttribute('customColor', new THREE.BufferAttribute(param.colors, 3));
      this.geometry.addAttribute('vertexOpacity', new THREE.BufferAttribute(param.opacities, 1));
      this.geometry.addAttribute('size', new THREE.BufferAttribute(param.sizes, 1));
      this.obj = new THREE.Points(this.geometry, this.material);
      param.scene.add(this.obj);
    },
    updatePoints: function() {
      this.obj.geometry.attributes.position.needsUpdate = true;
      this.obj.geometry.attributes.vertexOpacity.needsUpdate = true;
      this.obj.geometry.attributes.size.needsUpdate = true;
    },
    updateVelocity: function() {
      this.acceleration.divideScalar(this.mass);
      this.velocity.add(this.acceleration);
    },
    updatePosition: function() {
      this.obj.position.copy(this.velocity);
    },
    applyForce: function(vector) {
      this.acceleration.add(vector);
    },
    applyFriction: function() {
      var friction = Force.friction(this.acceleration, 0.1);
      this.applyForce(friction);
    },
    applyDragForce: function(value) {
      var drag = Force.drag(this.acceleration, value);
      this.applyForce(drag);
    },
    hook: function(rest_length, k) {
      var force = Force.hook(this.velocity, this.anchor, rest_length, k);
      this.applyForce(force);
    },
  };

  return Points;
};

module.exports = exports();

},{"../modules/force":3,"../modules/util":7}],7:[function(require,module,exports){
var exports = {
  getRandomInt: function(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  },
  getDegree: function(radian) {
    return radian / Math.PI * 180;
  },
  getRadian: function(degrees) {
    return degrees * Math.PI / 180;
  },
  getSpherical: function(rad1, rad2, r) {
    var x = Math.cos(rad1) * Math.cos(rad2) * r;
    var z = Math.cos(rad1) * Math.sin(rad2) * r;
    var y = Math.sin(rad1) * r;
    return new THREE.Vector3(x, y, z);
  }
};

module.exports = exports;

},{}],8:[function(require,module,exports){
var Util = require('./modules/util');
var debounce = require('./modules/debounce');
var Camera = require('./modules/camera');

var body_width = document.body.clientWidth;
var body_height = document.body.clientHeight;
var vector_mouse_down = new THREE.Vector2();
var vector_mouse_move = new THREE.Vector2();
var vector_mouse_end = new THREE.Vector2();

var canvas = null;
var renderer = null;
var scene = null;
var camera = null;

var running = null;
var sketch = {
  name: 'fire ball',
  obj: require('./sketches/fire_ball.js'),
  date: '2015.11.12',
  description: 'test of simple physics and additive blending.',
};

var sketch_title = document.querySelector('.sketch-title');
var sketch_date = document.querySelector('.sketch-date');
var sketch_description = document.querySelector('.sketch-description');

var initThree = function() {
  canvas = document.getElementById('canvas');
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  if (!renderer) {
    alert('Three.jsの初期化に失敗しました。');
  }
  renderer.setSize(body_width, body_height);
  canvas.appendChild(renderer.domElement);
  renderer.setClearColor(0x111111, 1.0);
  
  scene = new THREE.Scene();
  
  camera = new Camera();
  camera.init(body_width, body_height);
  
  running = new sketch.obj;
  running.init(scene, camera);
  sketch_title.innerHTML = sketch.name;
  sketch_date.innerHTML = 'date : ' + sketch.date;
  sketch_description.innerHTML = sketch.description;
};

var init = function() {
  initThree();
  renderloop();
  setEvent();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var render = function() {
  renderer.clear();
  running.render(camera);
  renderer.render(scene, camera.obj);
};

var renderloop = function() {
  var now = Date.now();
  requestAnimationFrame(renderloop);
  render();
};

var resizeRenderer = function() {
  body_width  = document.body.clientWidth;
  body_height = document.body.clientHeight;
  renderer.setSize(body_width, body_height);
  camera.resize(body_width, body_height);
};

var setEvent = function () {
  canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });

  canvas.addEventListener('selectstart', function (event) {
    event.preventDefault();
  });

  canvas.addEventListener('mousedown', function (event) {
    event.preventDefault();
    touchStart(event.clientX, event.clientY);
  });

  canvas.addEventListener('mousemove', function (event) {
    event.preventDefault();
    touchMove(event.clientX, event.clientY);
  });

  canvas.addEventListener('mouseup', function (event) {
    event.preventDefault();
    touchEnd();
  });

  canvas.addEventListener('touchstart', function (event) {
    event.preventDefault();
    touchStart(event.touches[0].clientX, event.touches[0].clientY);
  });

  canvas.addEventListener('touchmove', function (event) {
    event.preventDefault();
    touchMove(event.touches[0].clientX, event.touches[0].clientY);
  });

  canvas.addEventListener('touchend', function (event) {
    event.preventDefault();
    touchEnd();
  });
};

var transformVector2d = function(vector) {
  vector.x = (vector.x / body_width) * 2 - 1;
  vector.y = - (vector.y / body_height) * 2 + 1;
};

var touchStart = function(x, y) {
  vector_mouse_down.set(x, y);
  transformVector2d(vector_mouse_down);
  if (running.touchStart) running.touchStart(vector_mouse_down);
};

var touchMove = function(x, y) {
  vector_mouse_move.set(x, y);
  transformVector2d(vector_mouse_move);
  if (running.touchMove) running.touchMove(vector_mouse_down, vector_mouse_move, camera);
};

var touchEnd = function(x, y) {
  vector_mouse_end.copy(vector_mouse_move);
  if (running.touchEnd) running.touchEnd(vector_mouse_end);
};

init();

},{"./modules/camera":1,"./modules/debounce":2,"./modules/util":7,"./sketches/fire_ball.js":9}],9:[function(require,module,exports){
var Util = require('../modules/util');
var Mover = require('../modules/mover');
var Points = require('../modules/points.js');
var Light = require('../modules/pointLight');

var vs = "#define GLSLIFY 1\nattribute vec3 customColor;\nattribute float vertexOpacity;\nattribute float size;\n\nvarying vec3 vColor;\nvarying float fOpacity;\n\nvoid main() {\n  vColor = customColor;\n  fOpacity = vertexOpacity;\n  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n  gl_PointSize = size * (300.0 / length(mvPosition.xyz));\n  gl_Position = projectionMatrix * mvPosition;\n}\n";
var fs = "#define GLSLIFY 1\nuniform vec3 color;\nuniform sampler2D texture;\n\nvarying vec3 vColor;\nvarying float fOpacity;\n\nvoid main() {\n  gl_FragColor = vec4(color * vColor, fOpacity);\n  gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);\n}\n";

var exports = function(){
  var Sketch = function() {};
  var movers_num = 10000;
  var movers = [];
  var points = new Points();
  var light = new Light();
  var bg = null;
  var positions = new Float32Array(movers_num * 3);
  var colors = new Float32Array(movers_num * 3);
  var opacities = new Float32Array(movers_num);
  var sizes = new Float32Array(movers_num);
  var gravity = new THREE.Vector3(0, 0.1, 0);
  var last_time_activate = Date.now();
  var is_draged = false;

  var updateMover =  function() {
    for (var i = 0; i < movers.length; i++) {
      var mover = movers[i];
      if (mover.is_active) {
        mover.time++;
        mover.applyForce(gravity);
        mover.applyDragForce(0.01);
        mover.updateVelocity();
        mover.updatePosition();
        mover.position.sub(points.obj.position);
        if (mover.time > 50) {
          mover.size -= 0.7;
          mover.a -= 0.009;
        }
        if (mover.a <= 0) {
          mover.init(new THREE.Vector3(0, 0, 0));
          mover.time = 0;
          mover.a = 0.0;
          mover.inactivate();
        }
      }
      positions[i * 3 + 0] = mover.position.x;
      positions[i * 3 + 1] = mover.position.y;
      positions[i * 3 + 2] = mover.position.z;
      opacities[i] = mover.a;
      sizes[i] = mover.size;
    }
    points.updatePoints();
  };

  var activateMover =  function() {
    var count = 0;
    var now = Date.now();
    if (now - last_time_activate > 10) {
      for (var i = 0; i < movers.length; i++) {
        var mover = movers[i];
        if (mover.is_active) continue;
        var rad1 = Util.getRadian(Math.log(Util.getRandomInt(0, 256)) / Math.log(256) * 260);
        var rad2 = Util.getRadian(Util.getRandomInt(0, 360));
        var range = (1- Math.log(Util.getRandomInt(32, 256)) / Math.log(256)) * 12;
        var vector = new THREE.Vector3();
        var force = Util.getSpherical(rad1, rad2, range);
        vector.add(points.obj.position);
        mover.activate();
        mover.init(vector);
        mover.applyForce(force);
        mover.a = 0.2;
        mover.size = Math.pow(12 - range, 2) * Util.getRandomInt(1, 24) / 10;
        count++;
        if (count >= 6) break;
      }
      last_time_activate = Date.now();
    }
  };

  var updatePoints =  function() {
    points.updateVelocity();
    points.updatePosition();
    light.obj.position.copy(points.velocity);
  };

  var movePoints = function(vector) {
    var y = vector.y * document.body.clientHeight / 3;
    var z = vector.x * document.body.clientWidth / -3;
    points.anchor.y = y;
    points.anchor.z = z;
    light.anchor.y = y;
    light.anchor.z = z;
  }

  var createTexture =  function() {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var grad = null;
    var texture = null;

    canvas.width = 200;
    canvas.height = 200;
    grad = ctx.createRadialGradient(100, 100, 20, 100, 100, 100);
    grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
    grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.arc(100, 100, 100, 0, Math.PI / 180, true);
    ctx.fill();
    
    texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    return texture;
  };
  
  var createBackground =  function() {
    var geometry = new THREE.OctahedronGeometry(1500, 3);
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shading: THREE.FlatShading,
      side: THREE.BackSide
    });
    return new THREE.Mesh(geometry, material);
  };

  Sketch.prototype = {
    init: function(scene, camera) {
      for (var i = 0; i < movers_num; i++) {
        var mover = new Mover();
        var h = Util.getRandomInt(0, 45);
        var s = Util.getRandomInt(60, 90);
        var color = new THREE.Color('hsl(' + h + ', ' + s + '%, 50%)');

        mover.init(new THREE.Vector3(Util.getRandomInt(-100, 100), 0, 0));
        movers.push(mover);
        positions[i * 3 + 0] = mover.position.x;
        positions[i * 3 + 1] = mover.position.y;
        positions[i * 3 + 2] = mover.position.z;
        color.toArray(colors, i * 3);
        opacities[i] = mover.a;
        sizes[i] = mover.size;
      }
      points.init({
        scene: scene,
        vs: vs,
        fs: fs,
        positions: positions,
        colors: colors,
        opacities: opacities,
        sizes: sizes,
        texture: createTexture()
      });
      light.init(0xff6600, 1800);
      scene.add(light.obj);
      bg = createBackground();
      scene.add(bg);
      camera.rad1_base = Util.getRadian(25);
      camera.rad1 = camera.rad1_base;
      camera.rad2 = Util.getRadian(0);
      camera.setPositionSpherical();
    },
    remove: function(scene) {
      points.geometry.dispose();
      points.material.dispose();
      scene.remove(points.obj);
      scene.remove(light.obj);
      bg.geometry.dispose();
      bg.material.dispose();
      scene.remove(bg);
      movers = [];
    },
    render: function(camera) {
      points.hook(0, 0.08);
      points.applyDragForce(0.2);
      points.updateVelocity();
      points.updatePosition();
      light.hook(0, 0.08);
      light.applyDragForce(0.2);
      light.updateVelocity();
      light.updatePosition();
      activateMover();
      updateMover();
      camera.hook(0, 0.004);
      camera.applyDragForce(0.1);
      camera.updateVelocity();
      camera.updatePosition();
      camera.lookAtCenter();
    },
    touchStart: function(vector) {
      movePoints(vector);
      is_draged = true;
    },
    touchMove: function(vector_mouse_down, vector_mouse_move) {
      if (is_draged) {
        movePoints(vector_mouse_move);
      }
    },
    touchEnd: function(vector) {
      is_draged = false;
      points.anchor.set(0, 0, 0);
      light.anchor.set(0, 0, 0);
    }
  };

  return Sketch;
};

module.exports = exports();

},{"../modules/mover":4,"../modules/pointLight":5,"../modules/points.js":6,"../modules/util":7}]},{},[8])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbW9kdWxlcy9jYW1lcmEuanMiLCJzcmMvanMvbW9kdWxlcy9kZWJvdW5jZS5qcyIsInNyYy9qcy9tb2R1bGVzL2ZvcmNlLmpzIiwic3JjL2pzL21vZHVsZXMvbW92ZXIuanMiLCJzcmMvanMvbW9kdWxlcy9wb2ludExpZ2h0LmpzIiwic3JjL2pzL21vZHVsZXMvcG9pbnRzLmpzIiwic3JjL2pzL21vZHVsZXMvdXRpbC5qcyIsInNyYy9qcy9vbmx5X2RlbW8uanMiLCJzcmMvanMvc2tldGNoZXMvZmlyZV9iYWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIFV0aWwgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3V0aWwnKTtcbnZhciBGb3JjZSA9IHJlcXVpcmUoJy4uL21vZHVsZXMvZm9yY2UnKTtcblxudmFyIGV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICB2YXIgQ2FtZXJhID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yYWQxX2Jhc2UgPSBVdGlsLmdldFJhZGlhbigxMCk7XG4gICAgdGhpcy5yYWQxID0gdGhpcy5yYWQxX2Jhc2U7XG4gICAgdGhpcy5yYWQyID0gVXRpbC5nZXRSYWRpYW4oMCk7XG4gICAgdGhpcy5yYW5nZSA9IDEwMDA7XG4gICAgdGhpcy5vYmo7XG4gICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMuYW5jaG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLm1hc3MgPSAxO1xuICB9O1xuICBcbiAgQ2FtZXJhLnByb3RvdHlwZSA9IHtcbiAgICBpbml0OiBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICB0aGlzLm9iaiA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgzNSwgd2lkdGggLyBoZWlnaHQsIDEsIDEwMDAwKTtcbiAgICAgIHRoaXMub2JqLnVwLnNldCgwLCAxLCAwKTtcbiAgICAgIHRoaXMuc2V0UG9zaXRpb25TcGhlcmljYWwoKTtcbiAgICAgIHRoaXMudmVsb2NpdHkuY29weSh0aGlzLmFuY2hvcik7XG4gICAgICB0aGlzLmxvb2tBdENlbnRlcigpO1xuICAgIH0sXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zZXRQb3NpdGlvblNwaGVyaWNhbCgpO1xuICAgICAgdGhpcy5sb29rQXRDZW50ZXIoKTtcbiAgICB9LFxuICAgIHJlc2l6ZTogZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xuICAgICAgdGhpcy5vYmouYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XG4gICAgICB0aGlzLm9iai51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgfSxcbiAgICBzZXRQb3NpdGlvblNwaGVyaWNhbDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9pbnRzID0gVXRpbC5nZXRTcGhlcmljYWwodGhpcy5yYWQxLCB0aGlzLnJhZDIsIHRoaXMucmFuZ2UpO1xuICAgICAgdGhpcy5hbmNob3IuY29weShwb2ludHMpO1xuICAgIH0sXG4gICAgdXBkYXRlUG9zaXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vYmoucG9zaXRpb24uY29weSh0aGlzLnZlbG9jaXR5KTtcbiAgICB9LFxuICAgIHVwZGF0ZVZlbG9jaXR5OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuYWNjZWxlcmF0aW9uLmRpdmlkZVNjYWxhcih0aGlzLm1hc3MpO1xuICAgICAgdGhpcy52ZWxvY2l0eS5hZGQodGhpcy5hY2NlbGVyYXRpb24pO1xuICAgIH0sXG4gICAgYXBwbHlGb3JjZTogZnVuY3Rpb24odmVjdG9yKSB7XG4gICAgICB0aGlzLmFjY2VsZXJhdGlvbi5hZGQodmVjdG9yKTtcbiAgICB9LFxuICAgIGFwcGx5RnJpY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZyaWN0aW9uID0gRm9yY2UuZnJpY3Rpb24odGhpcy5hY2NlbGVyYXRpb24sIDAuMSk7XG4gICAgICB0aGlzLmFwcGx5Rm9yY2UoZnJpY3Rpb24pO1xuICAgIH0sXG4gICAgYXBwbHlEcmFnRm9yY2U6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgZHJhZyA9IEZvcmNlLmRyYWcodGhpcy5hY2NlbGVyYXRpb24sIHZhbHVlKTtcbiAgICAgIHRoaXMuYXBwbHlGb3JjZShkcmFnKTtcbiAgICB9LFxuICAgIGhvb2s6IGZ1bmN0aW9uKHJlc3RfbGVuZ3RoLCBrKSB7XG4gICAgICB2YXIgZm9yY2UgPSBGb3JjZS5ob29rKHRoaXMudmVsb2NpdHksIHRoaXMuYW5jaG9yLCByZXN0X2xlbmd0aCwgayk7XG4gICAgICB0aGlzLmFwcGx5Rm9yY2UoZm9yY2UpO1xuICAgIH0sXG4gICAgcm90YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMucmFkMV9iYXNlICs9IFV0aWwuZ2V0UmFkaWFuKDAuMjUpO1xuICAgICAgdGhpcy5yYWQxID0gVXRpbC5nZXRSYWRpYW4oTWF0aC5zaW4odGhpcy5yYWQxX2Jhc2UpICogODApO1xuICAgICAgdGhpcy5yYWQyICs9IFV0aWwuZ2V0UmFkaWFuKDAuNSk7XG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfSxcbiAgICBsb29rQXRDZW50ZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vYmoubG9va0F0KHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMCxcbiAgICAgICAgejogMFxuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gQ2FtZXJhO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzKCk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZXZlbnRUeXBlLCBjYWxsYmFjayl7XG4gIHZhciB0aW1lcjtcblxuICBvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgIGNhbGxiYWNrKGV2ZW50KTtcbiAgICB9LCA1MDApO1xuICB9LCBmYWxzZSk7XG59O1xuIiwidmFyIGV4cG9ydHMgPSB7XG4gIGZyaWN0aW9uOiBmdW5jdGlvbihhY2NlbGVyYXRpb24sIG11LCBub3JtYWwsIG1hc3MpIHtcbiAgICB2YXIgZm9yY2UgPSBhY2NlbGVyYXRpb24uY2xvbmUoKTtcbiAgICBpZiAoIW5vcm1hbCkgbm9ybWFsID0gMTtcbiAgICBpZiAoIW1hc3MpIG1hc3MgPSAxO1xuICAgIGZvcmNlLm11bHRpcGx5U2NhbGFyKC0xKTtcbiAgICBmb3JjZS5ub3JtYWxpemUoKTtcbiAgICBmb3JjZS5tdWx0aXBseVNjYWxhcihtdSk7XG4gICAgcmV0dXJuIGZvcmNlO1xuICB9LFxuICBkcmFnOiBmdW5jdGlvbihhY2NlbGVyYXRpb24sIHZhbHVlKSB7XG4gICAgdmFyIGZvcmNlID0gYWNjZWxlcmF0aW9uLmNsb25lKCk7XG4gICAgZm9yY2UubXVsdGlwbHlTY2FsYXIoLTEpO1xuICAgIGZvcmNlLm5vcm1hbGl6ZSgpO1xuICAgIGZvcmNlLm11bHRpcGx5U2NhbGFyKGFjY2VsZXJhdGlvbi5sZW5ndGgoKSAqIHZhbHVlKTtcbiAgICByZXR1cm4gZm9yY2U7XG4gIH0sXG4gIGhvb2s6IGZ1bmN0aW9uKHZlbG9jaXR5LCBhbmNob3IsIHJlc3RfbGVuZ3RoLCBrKSB7XG4gICAgdmFyIGZvcmNlID0gdmVsb2NpdHkuY2xvbmUoKS5zdWIoYW5jaG9yKTtcbiAgICB2YXIgZGlzdGFuY2UgPSBmb3JjZS5sZW5ndGgoKSAtIHJlc3RfbGVuZ3RoO1xuICAgIGZvcmNlLm5vcm1hbGl6ZSgpO1xuICAgIGZvcmNlLm11bHRpcGx5U2NhbGFyKC0xICogayAqIGRpc3RhbmNlKTtcbiAgICByZXR1cm4gZm9yY2U7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcbiIsInZhciBVdGlsID0gcmVxdWlyZSgnLi4vbW9kdWxlcy91dGlsJyk7XG52YXIgRm9yY2UgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2ZvcmNlJyk7XG5cbnZhciBleHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgdmFyIE1vdmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdGhpcy52ZWxvY2l0eSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdGhpcy5hY2NlbGVyYXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMuYW5jaG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLm1hc3MgPSAxO1xuICAgIHRoaXMuciA9IDA7XG4gICAgdGhpcy5nID0gMDtcbiAgICB0aGlzLmIgPSAwO1xuICAgIHRoaXMuYSA9IDA7XG4gICAgdGhpcy5zaXplID0gMDtcbiAgICB0aGlzLnRpbWUgPSAwO1xuICAgIHRoaXMuaXNfYWN0aXZlID0gZmFsc2U7XG4gIH07XG4gIFxuICBNb3Zlci5wcm90b3R5cGUgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24odmVjdG9yKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uID0gdmVjdG9yLmNsb25lKCk7XG4gICAgICB0aGlzLnZlbG9jaXR5ID0gdmVjdG9yLmNsb25lKCk7XG4gICAgICB0aGlzLmFuY2hvciA9IHZlY3Rvci5jbG9uZSgpO1xuICAgICAgdGhpcy5hY2NlbGVyYXRpb24uc2V0KDAsIDAsIDApO1xuICAgICAgdGhpcy5hID0gMDtcbiAgICAgIHRoaXMudGltZSA9IDA7XG4gICAgfSxcbiAgICB1cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLnBvc2l0aW9uLmNvcHkodGhpcy52ZWxvY2l0eSk7XG4gICAgfSxcbiAgICB1cGRhdGVWZWxvY2l0eTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmFjY2VsZXJhdGlvbi5kaXZpZGVTY2FsYXIodGhpcy5tYXNzKTtcbiAgICAgIHRoaXMudmVsb2NpdHkuYWRkKHRoaXMuYWNjZWxlcmF0aW9uKTtcbiAgICAgIC8vIGlmICh0aGlzLnZlbG9jaXR5LmRpc3RhbmNlVG8odGhpcy5wb3NpdGlvbikgPj0gMSkge1xuICAgICAgLy8gICB0aGlzLmRpcmVjdCh0aGlzLnZlbG9jaXR5KTtcbiAgICAgIC8vIH1cbiAgICB9LFxuICAgIGFwcGx5Rm9yY2U6IGZ1bmN0aW9uKHZlY3Rvcikge1xuICAgICAgdGhpcy5hY2NlbGVyYXRpb24uYWRkKHZlY3Rvcik7XG4gICAgfSxcbiAgICBhcHBseUZyaWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBmcmljdGlvbiA9IEZvcmNlLmZyaWN0aW9uKHRoaXMuYWNjZWxlcmF0aW9uLCAwLjEpO1xuICAgICAgdGhpcy5hcHBseUZvcmNlKGZyaWN0aW9uKTtcbiAgICB9LFxuICAgIGFwcGx5RHJhZ0ZvcmNlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgdmFyIGRyYWcgPSBGb3JjZS5kcmFnKHRoaXMuYWNjZWxlcmF0aW9uLCB2YWx1ZSk7XG4gICAgICB0aGlzLmFwcGx5Rm9yY2UoZHJhZyk7XG4gICAgfSxcbiAgICBob29rOiBmdW5jdGlvbihyZXN0X2xlbmd0aCwgaykge1xuICAgICAgdmFyIGZvcmNlID0gRm9yY2UuaG9vayh0aGlzLnZlbG9jaXR5LCB0aGlzLmFuY2hvciwgcmVzdF9sZW5ndGgsIGspO1xuICAgICAgdGhpcy5hcHBseUZvcmNlKGZvcmNlKTtcbiAgICB9LFxuICAgIGFjdGl2YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmlzX2FjdGl2ZSA9IHRydWU7XG4gICAgfSxcbiAgICBpbmFjdGl2YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmlzX2FjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gTW92ZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMoKTtcbiIsInZhciBVdGlsID0gcmVxdWlyZSgnLi4vbW9kdWxlcy91dGlsJyk7XG52YXIgRm9yY2UgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2ZvcmNlJyk7XG5cbnZhciBleHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgdmFyIFBvaW50TGlnaHQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJhZDEgPSBVdGlsLmdldFJhZGlhbigwKTtcbiAgICB0aGlzLnJhZDIgPSBVdGlsLmdldFJhZGlhbigwKTtcbiAgICB0aGlzLnJhbmdlID0gMjAwO1xuICAgIHRoaXMuaGV4ID0gMHhmZmZmZmY7XG4gICAgdGhpcy5pbnRlbnNpdHkgPSAxO1xuICAgIHRoaXMuZGlzdGFuY2UgPSAyMDAwO1xuICAgIHRoaXMuZGVjYXkgPSAxO1xuICAgIHRoaXMub2JqO1xuICAgIHRoaXMudmVsb2NpdHkgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLmFuY2hvciA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdGhpcy5tYXNzID0gMTtcbiAgfTtcbiAgXG4gIFBvaW50TGlnaHQucHJvdG90eXBlID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKGhleCwgZGlzdGFuY2UpIHtcbiAgICAgIGlmIChoZXgpIHRoaXMuaGV4ID0gaGV4O1xuICAgICAgaWYgKGRpc3RhbmNlKSB0aGlzLmRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICB0aGlzLm9iaiA9IG5ldyBUSFJFRS5Qb2ludExpZ2h0KHRoaXMuaGV4LCB0aGlzLmludGVuc2l0eSwgdGhpcy5kaXN0YW5jZSwgdGhpcy5kZWNheSk7XG4gICAgICB0aGlzLnNldFBvc2l0aW9uU3BoZXJpY2FsKCk7XG4gICAgfSxcbiAgICBzZXRQb3NpdGlvblNwaGVyaWNhbDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcG9pbnRzID0gVXRpbC5nZXRTcGhlcmljYWwodGhpcy5yYWQxLCB0aGlzLnJhZDIsIHRoaXMucmFuZ2UpO1xuICAgICAgdGhpcy5vYmoucG9zaXRpb24uY29weShwb2ludHMpO1xuICAgIH0sXG4gICAgdXBkYXRlUG9zaXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5vYmoucG9zaXRpb24uY29weSh0aGlzLnZlbG9jaXR5KTtcbiAgICB9LFxuICAgIHVwZGF0ZVZlbG9jaXR5OiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuYWNjZWxlcmF0aW9uLmRpdmlkZVNjYWxhcih0aGlzLm1hc3MpO1xuICAgICAgdGhpcy52ZWxvY2l0eS5hZGQodGhpcy5hY2NlbGVyYXRpb24pO1xuICAgIH0sXG4gICAgYXBwbHlGb3JjZTogZnVuY3Rpb24odmVjdG9yKSB7XG4gICAgICB0aGlzLmFjY2VsZXJhdGlvbi5hZGQodmVjdG9yKTtcbiAgICB9LFxuICAgIGFwcGx5RnJpY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZyaWN0aW9uID0gRm9yY2UuZnJpY3Rpb24odGhpcy5hY2NlbGVyYXRpb24sIDAuMSk7XG4gICAgICB0aGlzLmFwcGx5Rm9yY2UoZnJpY3Rpb24pO1xuICAgIH0sXG4gICAgYXBwbHlEcmFnRm9yY2U6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICB2YXIgZHJhZyA9IEZvcmNlLmRyYWcodGhpcy5hY2NlbGVyYXRpb24sIHZhbHVlKTtcbiAgICAgIHRoaXMuYXBwbHlGb3JjZShkcmFnKTtcbiAgICB9LFxuICAgIGhvb2s6IGZ1bmN0aW9uKHJlc3RfbGVuZ3RoLCBrKSB7XG4gICAgICB2YXIgZm9yY2UgPSBGb3JjZS5ob29rKHRoaXMudmVsb2NpdHksIHRoaXMuYW5jaG9yLCByZXN0X2xlbmd0aCwgayk7XG4gICAgICB0aGlzLmFwcGx5Rm9yY2UoZm9yY2UpO1xuICAgIH0sXG4gIH07XG4gIFxuICByZXR1cm4gUG9pbnRMaWdodDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cygpO1xuIiwidmFyIFV0aWwgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3V0aWwnKTtcbnZhciBGb3JjZSA9IHJlcXVpcmUoJy4uL21vZHVsZXMvZm9yY2UnKTtcblxudmFyIGV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICB2YXIgUG9pbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5nZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgIHRoaXMubWF0ZXJpYWwgPSBudWxsO1xuICAgIHRoaXMub2JqID0gbnVsbDtcbiAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLmFjY2VsZXJhdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdGhpcy5hbmNob3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMubWFzcyA9IDE7XG4gIH07XG4gIFxuICBQb2ludHMucHJvdG90eXBlID0ge1xuICAgIGluaXQ6IGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICB0aGlzLm1hdGVyaWFsID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKHtcbiAgICAgICAgdW5pZm9ybXM6IHtcbiAgICAgICAgICBjb2xvcjogeyB0eXBlOiAnYycsIHZhbHVlOiBuZXcgVEhSRUUuQ29sb3IoMHhmZmZmZmYpIH0sXG4gICAgICAgICAgdGV4dHVyZTogeyB0eXBlOiAndCcsIHZhbHVlOiBwYXJhbS50ZXh0dXJlIH1cbiAgICAgICAgfSxcbiAgICAgICAgdmVydGV4U2hhZGVyOiBwYXJhbS52cyxcbiAgICAgICAgZnJhZ21lbnRTaGFkZXI6IHBhcmFtLmZzLFxuICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICAgICAgZGVwdGhXcml0ZTogZmFsc2UsXG4gICAgICAgIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nXG4gICAgICB9KTtcbiAgICAgIHRoaXMuZ2VvbWV0cnkuYWRkQXR0cmlidXRlKCdwb3NpdGlvbicsIG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUocGFyYW0ucG9zaXRpb25zLCAzKSk7XG4gICAgICB0aGlzLmdlb21ldHJ5LmFkZEF0dHJpYnV0ZSgnY3VzdG9tQ29sb3InLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHBhcmFtLmNvbG9ycywgMykpO1xuICAgICAgdGhpcy5nZW9tZXRyeS5hZGRBdHRyaWJ1dGUoJ3ZlcnRleE9wYWNpdHknLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHBhcmFtLm9wYWNpdGllcywgMSkpO1xuICAgICAgdGhpcy5nZW9tZXRyeS5hZGRBdHRyaWJ1dGUoJ3NpemUnLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHBhcmFtLnNpemVzLCAxKSk7XG4gICAgICB0aGlzLm9iaiA9IG5ldyBUSFJFRS5Qb2ludHModGhpcy5nZW9tZXRyeSwgdGhpcy5tYXRlcmlhbCk7XG4gICAgICBwYXJhbS5zY2VuZS5hZGQodGhpcy5vYmopO1xuICAgIH0sXG4gICAgdXBkYXRlUG9pbnRzOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub2JqLmdlb21ldHJ5LmF0dHJpYnV0ZXMucG9zaXRpb24ubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgICAgdGhpcy5vYmouZ2VvbWV0cnkuYXR0cmlidXRlcy52ZXJ0ZXhPcGFjaXR5Lm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICAgIHRoaXMub2JqLmdlb21ldHJ5LmF0dHJpYnV0ZXMuc2l6ZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgfSxcbiAgICB1cGRhdGVWZWxvY2l0eTogZnVuY3Rpb24oKSB7XG4gICAgICB0aGlzLmFjY2VsZXJhdGlvbi5kaXZpZGVTY2FsYXIodGhpcy5tYXNzKTtcbiAgICAgIHRoaXMudmVsb2NpdHkuYWRkKHRoaXMuYWNjZWxlcmF0aW9uKTtcbiAgICB9LFxuICAgIHVwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMub2JqLnBvc2l0aW9uLmNvcHkodGhpcy52ZWxvY2l0eSk7XG4gICAgfSxcbiAgICBhcHBseUZvcmNlOiBmdW5jdGlvbih2ZWN0b3IpIHtcbiAgICAgIHRoaXMuYWNjZWxlcmF0aW9uLmFkZCh2ZWN0b3IpO1xuICAgIH0sXG4gICAgYXBwbHlGcmljdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZnJpY3Rpb24gPSBGb3JjZS5mcmljdGlvbih0aGlzLmFjY2VsZXJhdGlvbiwgMC4xKTtcbiAgICAgIHRoaXMuYXBwbHlGb3JjZShmcmljdGlvbik7XG4gICAgfSxcbiAgICBhcHBseURyYWdGb3JjZTogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIHZhciBkcmFnID0gRm9yY2UuZHJhZyh0aGlzLmFjY2VsZXJhdGlvbiwgdmFsdWUpO1xuICAgICAgdGhpcy5hcHBseUZvcmNlKGRyYWcpO1xuICAgIH0sXG4gICAgaG9vazogZnVuY3Rpb24ocmVzdF9sZW5ndGgsIGspIHtcbiAgICAgIHZhciBmb3JjZSA9IEZvcmNlLmhvb2sodGhpcy52ZWxvY2l0eSwgdGhpcy5hbmNob3IsIHJlc3RfbGVuZ3RoLCBrKTtcbiAgICAgIHRoaXMuYXBwbHlGb3JjZShmb3JjZSk7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gUG9pbnRzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzKCk7XG4iLCJ2YXIgZXhwb3J0cyA9IHtcbiAgZ2V0UmFuZG9tSW50OiBmdW5jdGlvbihtaW4sIG1heCl7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcbiAgfSxcbiAgZ2V0RGVncmVlOiBmdW5jdGlvbihyYWRpYW4pIHtcbiAgICByZXR1cm4gcmFkaWFuIC8gTWF0aC5QSSAqIDE4MDtcbiAgfSxcbiAgZ2V0UmFkaWFuOiBmdW5jdGlvbihkZWdyZWVzKSB7XG4gICAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xuICB9LFxuICBnZXRTcGhlcmljYWw6IGZ1bmN0aW9uKHJhZDEsIHJhZDIsIHIpIHtcbiAgICB2YXIgeCA9IE1hdGguY29zKHJhZDEpICogTWF0aC5jb3MocmFkMikgKiByO1xuICAgIHZhciB6ID0gTWF0aC5jb3MocmFkMSkgKiBNYXRoLnNpbihyYWQyKSAqIHI7XG4gICAgdmFyIHkgPSBNYXRoLnNpbihyYWQxKSAqIHI7XG4gICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKHgsIHksIHopO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHM7XG4iLCJ2YXIgVXRpbCA9IHJlcXVpcmUoJy4vbW9kdWxlcy91dGlsJyk7XG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL21vZHVsZXMvZGVib3VuY2UnKTtcbnZhciBDYW1lcmEgPSByZXF1aXJlKCcuL21vZHVsZXMvY2FtZXJhJyk7XG5cbnZhciBib2R5X3dpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcbnZhciBib2R5X2hlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xudmFyIHZlY3Rvcl9tb3VzZV9kb3duID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbnZhciB2ZWN0b3JfbW91c2VfbW92ZSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG52YXIgdmVjdG9yX21vdXNlX2VuZCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG5cbnZhciBjYW52YXMgPSBudWxsO1xudmFyIHJlbmRlcmVyID0gbnVsbDtcbnZhciBzY2VuZSA9IG51bGw7XG52YXIgY2FtZXJhID0gbnVsbDtcblxudmFyIHJ1bm5pbmcgPSBudWxsO1xudmFyIHNrZXRjaCA9IHtcbiAgbmFtZTogJ2ZpcmUgYmFsbCcsXG4gIG9iajogcmVxdWlyZSgnLi9za2V0Y2hlcy9maXJlX2JhbGwuanMnKSxcbiAgZGF0ZTogJzIwMTUuMTEuMTInLFxuICBkZXNjcmlwdGlvbjogJ3Rlc3Qgb2Ygc2ltcGxlIHBoeXNpY3MgYW5kIGFkZGl0aXZlIGJsZW5kaW5nLicsXG59O1xuXG52YXIgc2tldGNoX3RpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNrZXRjaC10aXRsZScpO1xudmFyIHNrZXRjaF9kYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNrZXRjaC1kYXRlJyk7XG52YXIgc2tldGNoX2Rlc2NyaXB0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNrZXRjaC1kZXNjcmlwdGlvbicpO1xuXG52YXIgaW5pdFRocmVlID0gZnVuY3Rpb24oKSB7XG4gIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTtcbiAgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgYW50aWFsaWFzOiB0cnVlXG4gIH0pO1xuICBpZiAoIXJlbmRlcmVyKSB7XG4gICAgYWxlcnQoJ1RocmVlLmpz44Gu5Yid5pyf5YyW44Gr5aSx5pWX44GX44G+44GX44Gf44CCJyk7XG4gIH1cbiAgcmVuZGVyZXIuc2V0U2l6ZShib2R5X3dpZHRoLCBib2R5X2hlaWdodCk7XG4gIGNhbnZhcy5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcbiAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweDExMTExMSwgMS4wKTtcbiAgXG4gIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gIFxuICBjYW1lcmEgPSBuZXcgQ2FtZXJhKCk7XG4gIGNhbWVyYS5pbml0KGJvZHlfd2lkdGgsIGJvZHlfaGVpZ2h0KTtcbiAgXG4gIHJ1bm5pbmcgPSBuZXcgc2tldGNoLm9iajtcbiAgcnVubmluZy5pbml0KHNjZW5lLCBjYW1lcmEpO1xuICBza2V0Y2hfdGl0bGUuaW5uZXJIVE1MID0gc2tldGNoLm5hbWU7XG4gIHNrZXRjaF9kYXRlLmlubmVySFRNTCA9ICdkYXRlIDogJyArIHNrZXRjaC5kYXRlO1xuICBza2V0Y2hfZGVzY3JpcHRpb24uaW5uZXJIVE1MID0gc2tldGNoLmRlc2NyaXB0aW9uO1xufTtcblxudmFyIGluaXQgPSBmdW5jdGlvbigpIHtcbiAgaW5pdFRocmVlKCk7XG4gIHJlbmRlcmxvb3AoKTtcbiAgc2V0RXZlbnQoKTtcbiAgZGVib3VuY2Uod2luZG93LCAncmVzaXplJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgIHJlc2l6ZVJlbmRlcmVyKCk7XG4gIH0pO1xufTtcblxudmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICByZW5kZXJlci5jbGVhcigpO1xuICBydW5uaW5nLnJlbmRlcihjYW1lcmEpO1xuICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYS5vYmopO1xufTtcblxudmFyIHJlbmRlcmxvb3AgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXJsb29wKTtcbiAgcmVuZGVyKCk7XG59O1xuXG52YXIgcmVzaXplUmVuZGVyZXIgPSBmdW5jdGlvbigpIHtcbiAgYm9keV93aWR0aCAgPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuICBib2R5X2hlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xuICByZW5kZXJlci5zZXRTaXplKGJvZHlfd2lkdGgsIGJvZHlfaGVpZ2h0KTtcbiAgY2FtZXJhLnJlc2l6ZShib2R5X3dpZHRoLCBib2R5X2hlaWdodCk7XG59O1xuXG52YXIgc2V0RXZlbnQgPSBmdW5jdGlvbiAoKSB7XG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjb250ZXh0bWVudScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3RzdGFydCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH0pO1xuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRvdWNoU3RhcnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XG4gIH0pO1xuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRvdWNoTW92ZShldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgfSk7XG5cbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRvdWNoRW5kKCk7XG4gIH0pO1xuXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0b3VjaFN0YXJ0KGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCwgZXZlbnQudG91Y2hlc1swXS5jbGllbnRZKTtcbiAgfSk7XG5cbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdG91Y2hNb3ZlKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCwgZXZlbnQudG91Y2hlc1swXS5jbGllbnRZKTtcbiAgfSk7XG5cbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0b3VjaEVuZCgpO1xuICB9KTtcbn07XG5cbnZhciB0cmFuc2Zvcm1WZWN0b3IyZCA9IGZ1bmN0aW9uKHZlY3Rvcikge1xuICB2ZWN0b3IueCA9ICh2ZWN0b3IueCAvIGJvZHlfd2lkdGgpICogMiAtIDE7XG4gIHZlY3Rvci55ID0gLSAodmVjdG9yLnkgLyBib2R5X2hlaWdodCkgKiAyICsgMTtcbn07XG5cbnZhciB0b3VjaFN0YXJ0ID0gZnVuY3Rpb24oeCwgeSkge1xuICB2ZWN0b3JfbW91c2VfZG93bi5zZXQoeCwgeSk7XG4gIHRyYW5zZm9ybVZlY3RvcjJkKHZlY3Rvcl9tb3VzZV9kb3duKTtcbiAgaWYgKHJ1bm5pbmcudG91Y2hTdGFydCkgcnVubmluZy50b3VjaFN0YXJ0KHZlY3Rvcl9tb3VzZV9kb3duKTtcbn07XG5cbnZhciB0b3VjaE1vdmUgPSBmdW5jdGlvbih4LCB5KSB7XG4gIHZlY3Rvcl9tb3VzZV9tb3ZlLnNldCh4LCB5KTtcbiAgdHJhbnNmb3JtVmVjdG9yMmQodmVjdG9yX21vdXNlX21vdmUpO1xuICBpZiAocnVubmluZy50b3VjaE1vdmUpIHJ1bm5pbmcudG91Y2hNb3ZlKHZlY3Rvcl9tb3VzZV9kb3duLCB2ZWN0b3JfbW91c2VfbW92ZSwgY2FtZXJhKTtcbn07XG5cbnZhciB0b3VjaEVuZCA9IGZ1bmN0aW9uKHgsIHkpIHtcbiAgdmVjdG9yX21vdXNlX2VuZC5jb3B5KHZlY3Rvcl9tb3VzZV9tb3ZlKTtcbiAgaWYgKHJ1bm5pbmcudG91Y2hFbmQpIHJ1bm5pbmcudG91Y2hFbmQodmVjdG9yX21vdXNlX2VuZCk7XG59O1xuXG5pbml0KCk7XG4iLCJ2YXIgVXRpbCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvdXRpbCcpO1xudmFyIE1vdmVyID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9tb3ZlcicpO1xudmFyIFBvaW50cyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvcG9pbnRzLmpzJyk7XG52YXIgTGlnaHQgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3BvaW50TGlnaHQnKTtcblxudmFyIHZzID0gXCIjZGVmaW5lIEdMU0xJRlkgMVxcbmF0dHJpYnV0ZSB2ZWMzIGN1c3RvbUNvbG9yO1xcbmF0dHJpYnV0ZSBmbG9hdCB2ZXJ0ZXhPcGFjaXR5O1xcbmF0dHJpYnV0ZSBmbG9hdCBzaXplO1xcblxcbnZhcnlpbmcgdmVjMyB2Q29sb3I7XFxudmFyeWluZyBmbG9hdCBmT3BhY2l0eTtcXG5cXG52b2lkIG1haW4oKSB7XFxuICB2Q29sb3IgPSBjdXN0b21Db2xvcjtcXG4gIGZPcGFjaXR5ID0gdmVydGV4T3BhY2l0eTtcXG4gIHZlYzQgbXZQb3NpdGlvbiA9IG1vZGVsVmlld01hdHJpeCAqIHZlYzQocG9zaXRpb24sIDEuMCk7XFxuICBnbF9Qb2ludFNpemUgPSBzaXplICogKDMwMC4wIC8gbGVuZ3RoKG12UG9zaXRpb24ueHl6KSk7XFxuICBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtdlBvc2l0aW9uO1xcbn1cXG5cIjtcbnZhciBmcyA9IFwiI2RlZmluZSBHTFNMSUZZIDFcXG51bmlmb3JtIHZlYzMgY29sb3I7XFxudW5pZm9ybSBzYW1wbGVyMkQgdGV4dHVyZTtcXG5cXG52YXJ5aW5nIHZlYzMgdkNvbG9yO1xcbnZhcnlpbmcgZmxvYXQgZk9wYWNpdHk7XFxuXFxudm9pZCBtYWluKCkge1xcbiAgZ2xfRnJhZ0NvbG9yID0gdmVjNChjb2xvciAqIHZDb2xvciwgZk9wYWNpdHkpO1xcbiAgZ2xfRnJhZ0NvbG9yID0gZ2xfRnJhZ0NvbG9yICogdGV4dHVyZTJEKHRleHR1cmUsIGdsX1BvaW50Q29vcmQpO1xcbn1cXG5cIjtcblxudmFyIGV4cG9ydHMgPSBmdW5jdGlvbigpe1xuICB2YXIgU2tldGNoID0gZnVuY3Rpb24oKSB7fTtcbiAgdmFyIG1vdmVyc19udW0gPSAxMDAwMDtcbiAgdmFyIG1vdmVycyA9IFtdO1xuICB2YXIgcG9pbnRzID0gbmV3IFBvaW50cygpO1xuICB2YXIgbGlnaHQgPSBuZXcgTGlnaHQoKTtcbiAgdmFyIGJnID0gbnVsbDtcbiAgdmFyIHBvc2l0aW9ucyA9IG5ldyBGbG9hdDMyQXJyYXkobW92ZXJzX251bSAqIDMpO1xuICB2YXIgY29sb3JzID0gbmV3IEZsb2F0MzJBcnJheShtb3ZlcnNfbnVtICogMyk7XG4gIHZhciBvcGFjaXRpZXMgPSBuZXcgRmxvYXQzMkFycmF5KG1vdmVyc19udW0pO1xuICB2YXIgc2l6ZXMgPSBuZXcgRmxvYXQzMkFycmF5KG1vdmVyc19udW0pO1xuICB2YXIgZ3Jhdml0eSA9IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAuMSwgMCk7XG4gIHZhciBsYXN0X3RpbWVfYWN0aXZhdGUgPSBEYXRlLm5vdygpO1xuICB2YXIgaXNfZHJhZ2VkID0gZmFsc2U7XG5cbiAgdmFyIHVwZGF0ZU1vdmVyID0gIGZ1bmN0aW9uKCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW92ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbW92ZXIgPSBtb3ZlcnNbaV07XG4gICAgICBpZiAobW92ZXIuaXNfYWN0aXZlKSB7XG4gICAgICAgIG1vdmVyLnRpbWUrKztcbiAgICAgICAgbW92ZXIuYXBwbHlGb3JjZShncmF2aXR5KTtcbiAgICAgICAgbW92ZXIuYXBwbHlEcmFnRm9yY2UoMC4wMSk7XG4gICAgICAgIG1vdmVyLnVwZGF0ZVZlbG9jaXR5KCk7XG4gICAgICAgIG1vdmVyLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICAgIG1vdmVyLnBvc2l0aW9uLnN1Yihwb2ludHMub2JqLnBvc2l0aW9uKTtcbiAgICAgICAgaWYgKG1vdmVyLnRpbWUgPiA1MCkge1xuICAgICAgICAgIG1vdmVyLnNpemUgLT0gMC43O1xuICAgICAgICAgIG1vdmVyLmEgLT0gMC4wMDk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vdmVyLmEgPD0gMCkge1xuICAgICAgICAgIG1vdmVyLmluaXQobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuICAgICAgICAgIG1vdmVyLnRpbWUgPSAwO1xuICAgICAgICAgIG1vdmVyLmEgPSAwLjA7XG4gICAgICAgICAgbW92ZXIuaW5hY3RpdmF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwb3NpdGlvbnNbaSAqIDMgKyAwXSA9IG1vdmVyLnBvc2l0aW9uLng7XG4gICAgICBwb3NpdGlvbnNbaSAqIDMgKyAxXSA9IG1vdmVyLnBvc2l0aW9uLnk7XG4gICAgICBwb3NpdGlvbnNbaSAqIDMgKyAyXSA9IG1vdmVyLnBvc2l0aW9uLno7XG4gICAgICBvcGFjaXRpZXNbaV0gPSBtb3Zlci5hO1xuICAgICAgc2l6ZXNbaV0gPSBtb3Zlci5zaXplO1xuICAgIH1cbiAgICBwb2ludHMudXBkYXRlUG9pbnRzKCk7XG4gIH07XG5cbiAgdmFyIGFjdGl2YXRlTW92ZXIgPSAgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvdW50ID0gMDtcbiAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBpZiAobm93IC0gbGFzdF90aW1lX2FjdGl2YXRlID4gMTApIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbW92ZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBtb3ZlciA9IG1vdmVyc1tpXTtcbiAgICAgICAgaWYgKG1vdmVyLmlzX2FjdGl2ZSkgY29udGludWU7XG4gICAgICAgIHZhciByYWQxID0gVXRpbC5nZXRSYWRpYW4oTWF0aC5sb2coVXRpbC5nZXRSYW5kb21JbnQoMCwgMjU2KSkgLyBNYXRoLmxvZygyNTYpICogMjYwKTtcbiAgICAgICAgdmFyIHJhZDIgPSBVdGlsLmdldFJhZGlhbihVdGlsLmdldFJhbmRvbUludCgwLCAzNjApKTtcbiAgICAgICAgdmFyIHJhbmdlID0gKDEtIE1hdGgubG9nKFV0aWwuZ2V0UmFuZG9tSW50KDMyLCAyNTYpKSAvIE1hdGgubG9nKDI1NikpICogMTI7XG4gICAgICAgIHZhciB2ZWN0b3IgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgICAgICB2YXIgZm9yY2UgPSBVdGlsLmdldFNwaGVyaWNhbChyYWQxLCByYWQyLCByYW5nZSk7XG4gICAgICAgIHZlY3Rvci5hZGQocG9pbnRzLm9iai5wb3NpdGlvbik7XG4gICAgICAgIG1vdmVyLmFjdGl2YXRlKCk7XG4gICAgICAgIG1vdmVyLmluaXQodmVjdG9yKTtcbiAgICAgICAgbW92ZXIuYXBwbHlGb3JjZShmb3JjZSk7XG4gICAgICAgIG1vdmVyLmEgPSAwLjI7XG4gICAgICAgIG1vdmVyLnNpemUgPSBNYXRoLnBvdygxMiAtIHJhbmdlLCAyKSAqIFV0aWwuZ2V0UmFuZG9tSW50KDEsIDI0KSAvIDEwO1xuICAgICAgICBjb3VudCsrO1xuICAgICAgICBpZiAoY291bnQgPj0gNikgYnJlYWs7XG4gICAgICB9XG4gICAgICBsYXN0X3RpbWVfYWN0aXZhdGUgPSBEYXRlLm5vdygpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgdXBkYXRlUG9pbnRzID0gIGZ1bmN0aW9uKCkge1xuICAgIHBvaW50cy51cGRhdGVWZWxvY2l0eSgpO1xuICAgIHBvaW50cy51cGRhdGVQb3NpdGlvbigpO1xuICAgIGxpZ2h0Lm9iai5wb3NpdGlvbi5jb3B5KHBvaW50cy52ZWxvY2l0eSk7XG4gIH07XG5cbiAgdmFyIG1vdmVQb2ludHMgPSBmdW5jdGlvbih2ZWN0b3IpIHtcbiAgICB2YXIgeSA9IHZlY3Rvci55ICogZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgLyAzO1xuICAgIHZhciB6ID0gdmVjdG9yLnggKiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC8gLTM7XG4gICAgcG9pbnRzLmFuY2hvci55ID0geTtcbiAgICBwb2ludHMuYW5jaG9yLnogPSB6O1xuICAgIGxpZ2h0LmFuY2hvci55ID0geTtcbiAgICBsaWdodC5hbmNob3IueiA9IHo7XG4gIH1cblxuICB2YXIgY3JlYXRlVGV4dHVyZSA9ICBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgIHZhciBncmFkID0gbnVsbDtcbiAgICB2YXIgdGV4dHVyZSA9IG51bGw7XG5cbiAgICBjYW52YXMud2lkdGggPSAyMDA7XG4gICAgY2FudmFzLmhlaWdodCA9IDIwMDtcbiAgICBncmFkID0gY3R4LmNyZWF0ZVJhZGlhbEdyYWRpZW50KDEwMCwgMTAwLCAyMCwgMTAwLCAxMDAsIDEwMCk7XG4gICAgZ3JhZC5hZGRDb2xvclN0b3AoMC4yLCAncmdiYSgyNTUsIDI1NSwgMjU1LCAxKScpO1xuICAgIGdyYWQuYWRkQ29sb3JTdG9wKDAuNSwgJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4zKScpO1xuICAgIGdyYWQuYWRkQ29sb3JTdG9wKDEuMCwgJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMCknKTtcbiAgICBjdHguZmlsbFN0eWxlID0gZ3JhZDtcbiAgICBjdHguYXJjKDEwMCwgMTAwLCAxMDAsIDAsIE1hdGguUEkgLyAxODAsIHRydWUpO1xuICAgIGN0eC5maWxsKCk7XG4gICAgXG4gICAgdGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGNhbnZhcyk7XG4gICAgdGV4dHVyZS5taW5GaWx0ZXIgPSBUSFJFRS5OZWFyZXN0RmlsdGVyO1xuICAgIHRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgIHJldHVybiB0ZXh0dXJlO1xuICB9O1xuICBcbiAgdmFyIGNyZWF0ZUJhY2tncm91bmQgPSAgZnVuY3Rpb24oKSB7XG4gICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLk9jdGFoZWRyb25HZW9tZXRyeSgxNTAwLCAzKTtcbiAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IDB4ZmZmZmZmLFxuICAgICAgc2hhZGluZzogVEhSRUUuRmxhdFNoYWRpbmcsXG4gICAgICBzaWRlOiBUSFJFRS5CYWNrU2lkZVxuICAgIH0pO1xuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICB9O1xuXG4gIFNrZXRjaC5wcm90b3R5cGUgPSB7XG4gICAgaW5pdDogZnVuY3Rpb24oc2NlbmUsIGNhbWVyYSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtb3ZlcnNfbnVtOyBpKyspIHtcbiAgICAgICAgdmFyIG1vdmVyID0gbmV3IE1vdmVyKCk7XG4gICAgICAgIHZhciBoID0gVXRpbC5nZXRSYW5kb21JbnQoMCwgNDUpO1xuICAgICAgICB2YXIgcyA9IFV0aWwuZ2V0UmFuZG9tSW50KDYwLCA5MCk7XG4gICAgICAgIHZhciBjb2xvciA9IG5ldyBUSFJFRS5Db2xvcignaHNsKCcgKyBoICsgJywgJyArIHMgKyAnJSwgNTAlKScpO1xuXG4gICAgICAgIG1vdmVyLmluaXQobmV3IFRIUkVFLlZlY3RvcjMoVXRpbC5nZXRSYW5kb21JbnQoLTEwMCwgMTAwKSwgMCwgMCkpO1xuICAgICAgICBtb3ZlcnMucHVzaChtb3Zlcik7XG4gICAgICAgIHBvc2l0aW9uc1tpICogMyArIDBdID0gbW92ZXIucG9zaXRpb24ueDtcbiAgICAgICAgcG9zaXRpb25zW2kgKiAzICsgMV0gPSBtb3Zlci5wb3NpdGlvbi55O1xuICAgICAgICBwb3NpdGlvbnNbaSAqIDMgKyAyXSA9IG1vdmVyLnBvc2l0aW9uLno7XG4gICAgICAgIGNvbG9yLnRvQXJyYXkoY29sb3JzLCBpICogMyk7XG4gICAgICAgIG9wYWNpdGllc1tpXSA9IG1vdmVyLmE7XG4gICAgICAgIHNpemVzW2ldID0gbW92ZXIuc2l6ZTtcbiAgICAgIH1cbiAgICAgIHBvaW50cy5pbml0KHtcbiAgICAgICAgc2NlbmU6IHNjZW5lLFxuICAgICAgICB2czogdnMsXG4gICAgICAgIGZzOiBmcyxcbiAgICAgICAgcG9zaXRpb25zOiBwb3NpdGlvbnMsXG4gICAgICAgIGNvbG9yczogY29sb3JzLFxuICAgICAgICBvcGFjaXRpZXM6IG9wYWNpdGllcyxcbiAgICAgICAgc2l6ZXM6IHNpemVzLFxuICAgICAgICB0ZXh0dXJlOiBjcmVhdGVUZXh0dXJlKClcbiAgICAgIH0pO1xuICAgICAgbGlnaHQuaW5pdCgweGZmNjYwMCwgMTgwMCk7XG4gICAgICBzY2VuZS5hZGQobGlnaHQub2JqKTtcbiAgICAgIGJnID0gY3JlYXRlQmFja2dyb3VuZCgpO1xuICAgICAgc2NlbmUuYWRkKGJnKTtcbiAgICAgIGNhbWVyYS5yYWQxX2Jhc2UgPSBVdGlsLmdldFJhZGlhbigyNSk7XG4gICAgICBjYW1lcmEucmFkMSA9IGNhbWVyYS5yYWQxX2Jhc2U7XG4gICAgICBjYW1lcmEucmFkMiA9IFV0aWwuZ2V0UmFkaWFuKDApO1xuICAgICAgY2FtZXJhLnNldFBvc2l0aW9uU3BoZXJpY2FsKCk7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uKHNjZW5lKSB7XG4gICAgICBwb2ludHMuZ2VvbWV0cnkuZGlzcG9zZSgpO1xuICAgICAgcG9pbnRzLm1hdGVyaWFsLmRpc3Bvc2UoKTtcbiAgICAgIHNjZW5lLnJlbW92ZShwb2ludHMub2JqKTtcbiAgICAgIHNjZW5lLnJlbW92ZShsaWdodC5vYmopO1xuICAgICAgYmcuZ2VvbWV0cnkuZGlzcG9zZSgpO1xuICAgICAgYmcubWF0ZXJpYWwuZGlzcG9zZSgpO1xuICAgICAgc2NlbmUucmVtb3ZlKGJnKTtcbiAgICAgIG1vdmVycyA9IFtdO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbihjYW1lcmEpIHtcbiAgICAgIHBvaW50cy5ob29rKDAsIDAuMDgpO1xuICAgICAgcG9pbnRzLmFwcGx5RHJhZ0ZvcmNlKDAuMik7XG4gICAgICBwb2ludHMudXBkYXRlVmVsb2NpdHkoKTtcbiAgICAgIHBvaW50cy51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgbGlnaHQuaG9vaygwLCAwLjA4KTtcbiAgICAgIGxpZ2h0LmFwcGx5RHJhZ0ZvcmNlKDAuMik7XG4gICAgICBsaWdodC51cGRhdGVWZWxvY2l0eSgpO1xuICAgICAgbGlnaHQudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgIGFjdGl2YXRlTW92ZXIoKTtcbiAgICAgIHVwZGF0ZU1vdmVyKCk7XG4gICAgICBjYW1lcmEuaG9vaygwLCAwLjAwNCk7XG4gICAgICBjYW1lcmEuYXBwbHlEcmFnRm9yY2UoMC4xKTtcbiAgICAgIGNhbWVyYS51cGRhdGVWZWxvY2l0eSgpO1xuICAgICAgY2FtZXJhLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgICBjYW1lcmEubG9va0F0Q2VudGVyKCk7XG4gICAgfSxcbiAgICB0b3VjaFN0YXJ0OiBmdW5jdGlvbih2ZWN0b3IpIHtcbiAgICAgIG1vdmVQb2ludHModmVjdG9yKTtcbiAgICAgIGlzX2RyYWdlZCA9IHRydWU7XG4gICAgfSxcbiAgICB0b3VjaE1vdmU6IGZ1bmN0aW9uKHZlY3Rvcl9tb3VzZV9kb3duLCB2ZWN0b3JfbW91c2VfbW92ZSkge1xuICAgICAgaWYgKGlzX2RyYWdlZCkge1xuICAgICAgICBtb3ZlUG9pbnRzKHZlY3Rvcl9tb3VzZV9tb3ZlKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHRvdWNoRW5kOiBmdW5jdGlvbih2ZWN0b3IpIHtcbiAgICAgIGlzX2RyYWdlZCA9IGZhbHNlO1xuICAgICAgcG9pbnRzLmFuY2hvci5zZXQoMCwgMCwgMCk7XG4gICAgICBsaWdodC5hbmNob3Iuc2V0KDAsIDAsIDApO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gU2tldGNoO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzKCk7XG4iXX0=
