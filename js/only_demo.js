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
    Force.call(this);
  };
  Camera.prototype = Object.create(Force.prototype);
  Camera.prototype.constructor = Camera;
  Camera.prototype.init = function(width, height) {
    this.obj = new THREE.PerspectiveCamera(35, width / height, 1, 10000);
    this.obj.up.set(0, 1, 0);
    this.position = this.obj.position;
    this.setPositionSpherical();
    this.velocity.copy(this.anchor);
    this.lookAtCenter();
  };
  Camera.prototype.reset = function() {
    this.setPositionSpherical();
    this.lookAtCenter();
  };
  Camera.prototype.resize = function(width, height) {
    this.obj.aspect = width / height;
    this.obj.updateProjectionMatrix();
  };
  Camera.prototype.setPositionSpherical = function() {
    var points = Util.getSpherical(this.rad1, this.rad2, this.range);
    this.anchor.copy(points);
  };
  Camera.prototype.rotate = function() {
    this.rad1_base += Util.getRadian(0.25);
    this.rad1 = Util.getRadian(Math.sin(this.rad1_base) * 80);
    this.rad2 += Util.getRadian(0.5);
    this.reset();
  };
  Camera.prototype.lookAtCenter = function() {
    this.obj.lookAt({
      x: 0,
      y: 0,
      z: 0
    });
  };
  return Camera;
};

module.exports = exports();

},{"../modules/force":3,"../modules/util":4}],2:[function(require,module,exports){
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
var Util = require('../modules/util');

var exports = function(){
  var Force = function() {
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
    this.mass = 1;
  };
  
  Force.prototype.updatePosition = function() {
    this.position.copy(this.velocity);
  };
  Force.prototype.updateVelocity = function() {
    this.acceleration.divideScalar(this.mass);
    this.velocity.add(this.acceleration);
  };
  Force.prototype.applyForce = function(vector) {
    this.acceleration.add(vector);
  };
  Force.prototype.applyFriction = function(mu, normal) {
    var force = this.acceleration.clone();
    if (!normal) normal = 1;
    force.multiplyScalar(-1);
    force.normalize();
    force.multiplyScalar(mu);
    this.applyForce(force);
  };
  Force.prototype.applyDrag = function(value) {
    var force = this.acceleration.clone();
    force.multiplyScalar(-1);
    force.normalize();
    force.multiplyScalar(this.acceleration.length() * value);
    this.applyForce(force);
  };
  Force.prototype.applyHook = function(rest_length, k) {
    var force = this.velocity.clone().sub(this.anchor);
    var distance = force.length() - rest_length;
    force.normalize();
    force.multiplyScalar(-1 * k * distance);
    this.applyForce(force);
  };

  return Force;
};

module.exports = exports();

},{"../modules/util":4}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
  name: 'gallery',
  obj: require('./sketches/gallery'),
  date: '2015.11.24',
  description: '',
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

},{"./modules/camera":1,"./modules/debounce":2,"./modules/util":4,"./sketches/gallery":6}],6:[function(require,module,exports){
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

},{"../modules/util":4}]},{},[5])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbW9kdWxlcy9jYW1lcmEuanMiLCJzcmMvanMvbW9kdWxlcy9kZWJvdW5jZS5qcyIsInNyYy9qcy9tb2R1bGVzL2ZvcmNlLmpzIiwic3JjL2pzL21vZHVsZXMvdXRpbC5qcyIsInNyYy9qcy9vbmx5X2RlbW8uanMiLCJzcmMvanMvc2tldGNoZXMvZ2FsbGVyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgVXRpbCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvdXRpbCcpO1xyXG52YXIgRm9yY2UgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2ZvcmNlJyk7XHJcblxyXG52YXIgZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIENhbWVyYSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5yYWQxX2Jhc2UgPSBVdGlsLmdldFJhZGlhbigxMCk7XHJcbiAgICB0aGlzLnJhZDEgPSB0aGlzLnJhZDFfYmFzZTtcclxuICAgIHRoaXMucmFkMiA9IFV0aWwuZ2V0UmFkaWFuKDApO1xyXG4gICAgdGhpcy5yYW5nZSA9IDEwMDA7XHJcbiAgICB0aGlzLm9iajtcclxuICAgIEZvcmNlLmNhbGwodGhpcyk7XHJcbiAgfTtcclxuICBDYW1lcmEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShGb3JjZS5wcm90b3R5cGUpO1xyXG4gIENhbWVyYS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDYW1lcmE7XHJcbiAgQ2FtZXJhLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24od2lkdGgsIGhlaWdodCkge1xyXG4gICAgdGhpcy5vYmogPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoMzUsIHdpZHRoIC8gaGVpZ2h0LCAxLCAxMDAwMCk7XHJcbiAgICB0aGlzLm9iai51cC5zZXQoMCwgMSwgMCk7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5vYmoucG9zaXRpb247XHJcbiAgICB0aGlzLnNldFBvc2l0aW9uU3BoZXJpY2FsKCk7XHJcbiAgICB0aGlzLnZlbG9jaXR5LmNvcHkodGhpcy5hbmNob3IpO1xyXG4gICAgdGhpcy5sb29rQXRDZW50ZXIoKTtcclxuICB9O1xyXG4gIENhbWVyYS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuc2V0UG9zaXRpb25TcGhlcmljYWwoKTtcclxuICAgIHRoaXMubG9va0F0Q2VudGVyKCk7XHJcbiAgfTtcclxuICBDYW1lcmEucHJvdG90eXBlLnJlc2l6ZSA9IGZ1bmN0aW9uKHdpZHRoLCBoZWlnaHQpIHtcclxuICAgIHRoaXMub2JqLmFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0O1xyXG4gICAgdGhpcy5vYmoudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xyXG4gIH07XHJcbiAgQ2FtZXJhLnByb3RvdHlwZS5zZXRQb3NpdGlvblNwaGVyaWNhbCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHBvaW50cyA9IFV0aWwuZ2V0U3BoZXJpY2FsKHRoaXMucmFkMSwgdGhpcy5yYWQyLCB0aGlzLnJhbmdlKTtcclxuICAgIHRoaXMuYW5jaG9yLmNvcHkocG9pbnRzKTtcclxuICB9O1xyXG4gIENhbWVyYS5wcm90b3R5cGUucm90YXRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLnJhZDFfYmFzZSArPSBVdGlsLmdldFJhZGlhbigwLjI1KTtcclxuICAgIHRoaXMucmFkMSA9IFV0aWwuZ2V0UmFkaWFuKE1hdGguc2luKHRoaXMucmFkMV9iYXNlKSAqIDgwKTtcclxuICAgIHRoaXMucmFkMiArPSBVdGlsLmdldFJhZGlhbigwLjUpO1xyXG4gICAgdGhpcy5yZXNldCgpO1xyXG4gIH07XHJcbiAgQ2FtZXJhLnByb3RvdHlwZS5sb29rQXRDZW50ZXIgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMub2JqLmxvb2tBdCh7XHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDAsXHJcbiAgICAgIHo6IDBcclxuICAgIH0pO1xyXG4gIH07XHJcbiAgcmV0dXJuIENhbWVyYTtcclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cygpO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZXZlbnRUeXBlLCBjYWxsYmFjayl7XHJcbiAgdmFyIHRpbWVyO1xyXG5cclxuICBvYmplY3QuYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xyXG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgIGNhbGxiYWNrKGV2ZW50KTtcclxuICAgIH0sIDUwMCk7XHJcbiAgfSwgZmFsc2UpO1xyXG59O1xyXG4iLCJ2YXIgVXRpbCA9IHJlcXVpcmUoJy4uL21vZHVsZXMvdXRpbCcpO1xyXG5cclxudmFyIGV4cG9ydHMgPSBmdW5jdGlvbigpe1xyXG4gIHZhciBGb3JjZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICB0aGlzLnZlbG9jaXR5ID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIHRoaXMuYWNjZWxlcmF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIHRoaXMuYW5jaG9yID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIHRoaXMubWFzcyA9IDE7XHJcbiAgfTtcclxuICBcclxuICBGb3JjZS5wcm90b3R5cGUudXBkYXRlUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMucG9zaXRpb24uY29weSh0aGlzLnZlbG9jaXR5KTtcclxuICB9O1xyXG4gIEZvcmNlLnByb3RvdHlwZS51cGRhdGVWZWxvY2l0eSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5hY2NlbGVyYXRpb24uZGl2aWRlU2NhbGFyKHRoaXMubWFzcyk7XHJcbiAgICB0aGlzLnZlbG9jaXR5LmFkZCh0aGlzLmFjY2VsZXJhdGlvbik7XHJcbiAgfTtcclxuICBGb3JjZS5wcm90b3R5cGUuYXBwbHlGb3JjZSA9IGZ1bmN0aW9uKHZlY3Rvcikge1xyXG4gICAgdGhpcy5hY2NlbGVyYXRpb24uYWRkKHZlY3Rvcik7XHJcbiAgfTtcclxuICBGb3JjZS5wcm90b3R5cGUuYXBwbHlGcmljdGlvbiA9IGZ1bmN0aW9uKG11LCBub3JtYWwpIHtcclxuICAgIHZhciBmb3JjZSA9IHRoaXMuYWNjZWxlcmF0aW9uLmNsb25lKCk7XHJcbiAgICBpZiAoIW5vcm1hbCkgbm9ybWFsID0gMTtcclxuICAgIGZvcmNlLm11bHRpcGx5U2NhbGFyKC0xKTtcclxuICAgIGZvcmNlLm5vcm1hbGl6ZSgpO1xyXG4gICAgZm9yY2UubXVsdGlwbHlTY2FsYXIobXUpO1xyXG4gICAgdGhpcy5hcHBseUZvcmNlKGZvcmNlKTtcclxuICB9O1xyXG4gIEZvcmNlLnByb3RvdHlwZS5hcHBseURyYWcgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdmFyIGZvcmNlID0gdGhpcy5hY2NlbGVyYXRpb24uY2xvbmUoKTtcclxuICAgIGZvcmNlLm11bHRpcGx5U2NhbGFyKC0xKTtcclxuICAgIGZvcmNlLm5vcm1hbGl6ZSgpO1xyXG4gICAgZm9yY2UubXVsdGlwbHlTY2FsYXIodGhpcy5hY2NlbGVyYXRpb24ubGVuZ3RoKCkgKiB2YWx1ZSk7XHJcbiAgICB0aGlzLmFwcGx5Rm9yY2UoZm9yY2UpO1xyXG4gIH07XHJcbiAgRm9yY2UucHJvdG90eXBlLmFwcGx5SG9vayA9IGZ1bmN0aW9uKHJlc3RfbGVuZ3RoLCBrKSB7XHJcbiAgICB2YXIgZm9yY2UgPSB0aGlzLnZlbG9jaXR5LmNsb25lKCkuc3ViKHRoaXMuYW5jaG9yKTtcclxuICAgIHZhciBkaXN0YW5jZSA9IGZvcmNlLmxlbmd0aCgpIC0gcmVzdF9sZW5ndGg7XHJcbiAgICBmb3JjZS5ub3JtYWxpemUoKTtcclxuICAgIGZvcmNlLm11bHRpcGx5U2NhbGFyKC0xICogayAqIGRpc3RhbmNlKTtcclxuICAgIHRoaXMuYXBwbHlGb3JjZShmb3JjZSk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIEZvcmNlO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzKCk7XHJcbiIsInZhciBleHBvcnRzID0ge1xyXG4gIGdldFJhbmRvbUludDogZnVuY3Rpb24obWluLCBtYXgpe1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcclxuICB9LFxyXG4gIGdldERlZ3JlZTogZnVuY3Rpb24ocmFkaWFuKSB7XHJcbiAgICByZXR1cm4gcmFkaWFuIC8gTWF0aC5QSSAqIDE4MDtcclxuICB9LFxyXG4gIGdldFJhZGlhbjogZnVuY3Rpb24oZGVncmVlcykge1xyXG4gICAgcmV0dXJuIGRlZ3JlZXMgKiBNYXRoLlBJIC8gMTgwO1xyXG4gIH0sXHJcbiAgZ2V0U3BoZXJpY2FsOiBmdW5jdGlvbihyYWQxLCByYWQyLCByKSB7XHJcbiAgICB2YXIgeCA9IE1hdGguY29zKHJhZDEpICogTWF0aC5jb3MocmFkMikgKiByO1xyXG4gICAgdmFyIHogPSBNYXRoLmNvcyhyYWQxKSAqIE1hdGguc2luKHJhZDIpICogcjtcclxuICAgIHZhciB5ID0gTWF0aC5zaW4ocmFkMSkgKiByO1xyXG4gICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKHgsIHksIHopO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cztcclxuIiwidmFyIFV0aWwgPSByZXF1aXJlKCcuL21vZHVsZXMvdXRpbCcpO1xyXG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuL21vZHVsZXMvZGVib3VuY2UnKTtcclxudmFyIENhbWVyYSA9IHJlcXVpcmUoJy4vbW9kdWxlcy9jYW1lcmEnKTtcclxuXHJcbnZhciBib2R5X3dpZHRoID0gZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aDtcclxudmFyIGJvZHlfaGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XHJcbnZhciB2ZWN0b3JfbW91c2VfZG93biA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcbnZhciB2ZWN0b3JfbW91c2VfbW92ZSA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XHJcbnZhciB2ZWN0b3JfbW91c2VfZW5kID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcclxuXHJcbnZhciBjYW52YXMgPSBudWxsO1xyXG52YXIgcmVuZGVyZXIgPSBudWxsO1xyXG52YXIgc2NlbmUgPSBudWxsO1xyXG52YXIgY2FtZXJhID0gbnVsbDtcclxuXHJcbnZhciBydW5uaW5nID0gbnVsbDtcclxudmFyIHNrZXRjaCA9IHtcclxuICBuYW1lOiAnZ2FsbGVyeScsXHJcbiAgb2JqOiByZXF1aXJlKCcuL3NrZXRjaGVzL2dhbGxlcnknKSxcclxuICBkYXRlOiAnMjAxNS4xMS4yNCcsXHJcbiAgZGVzY3JpcHRpb246ICcnLFxyXG59O1xyXG5cclxudmFyIHNrZXRjaF90aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5za2V0Y2gtdGl0bGUnKTtcclxudmFyIHNrZXRjaF9kYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNrZXRjaC1kYXRlJyk7XHJcbnZhciBza2V0Y2hfZGVzY3JpcHRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2tldGNoLWRlc2NyaXB0aW9uJyk7XHJcblxyXG52YXIgaW5pdFRocmVlID0gZnVuY3Rpb24oKSB7XHJcbiAgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpO1xyXG4gIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xyXG4gICAgYW50aWFsaWFzOiB0cnVlXHJcbiAgfSk7XHJcbiAgaWYgKCFyZW5kZXJlcikge1xyXG4gICAgYWxlcnQoJ1RocmVlLmpz44Gu5Yid5pyf5YyW44Gr5aSx5pWX44GX44G+44GX44Gf44CCJyk7XHJcbiAgfVxyXG4gIHJlbmRlcmVyLnNldFNpemUoYm9keV93aWR0aCwgYm9keV9oZWlnaHQpO1xyXG4gIGNhbnZhcy5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcclxuICByZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MTExMTExLCAxLjApO1xyXG4gIFxyXG4gIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcbiAgXHJcbiAgY2FtZXJhID0gbmV3IENhbWVyYSgpO1xyXG4gIGNhbWVyYS5pbml0KGJvZHlfd2lkdGgsIGJvZHlfaGVpZ2h0KTtcclxuICBcclxuICBydW5uaW5nID0gbmV3IHNrZXRjaC5vYmo7XHJcbiAgcnVubmluZy5pbml0KHNjZW5lLCBjYW1lcmEpO1xyXG4gIHNrZXRjaF90aXRsZS5pbm5lckhUTUwgPSBza2V0Y2gubmFtZTtcclxuICBza2V0Y2hfZGF0ZS5pbm5lckhUTUwgPSAnZGF0ZSA6ICcgKyBza2V0Y2guZGF0ZTtcclxuICBza2V0Y2hfZGVzY3JpcHRpb24uaW5uZXJIVE1MID0gc2tldGNoLmRlc2NyaXB0aW9uO1xyXG59O1xyXG5cclxudmFyIGluaXQgPSBmdW5jdGlvbigpIHtcclxuICBpbml0VGhyZWUoKTtcclxuICByZW5kZXJsb29wKCk7XHJcbiAgc2V0RXZlbnQoKTtcclxuICBkZWJvdW5jZSh3aW5kb3csICdyZXNpemUnLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICByZXNpemVSZW5kZXJlcigpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxudmFyIHJlbmRlciA9IGZ1bmN0aW9uKCkge1xyXG4gIHJlbmRlcmVyLmNsZWFyKCk7XHJcbiAgcnVubmluZy5yZW5kZXIoY2FtZXJhKTtcclxuICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYS5vYmopO1xyXG59O1xyXG5cclxudmFyIHJlbmRlcmxvb3AgPSBmdW5jdGlvbigpIHtcclxuICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcclxuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVybG9vcCk7XHJcbiAgcmVuZGVyKCk7XHJcbn07XHJcblxyXG52YXIgcmVzaXplUmVuZGVyZXIgPSBmdW5jdGlvbigpIHtcclxuICBib2R5X3dpZHRoICA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XHJcbiAgYm9keV9oZWlnaHQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcclxuICByZW5kZXJlci5zZXRTaXplKGJvZHlfd2lkdGgsIGJvZHlfaGVpZ2h0KTtcclxuICBjYW1lcmEucmVzaXplKGJvZHlfd2lkdGgsIGJvZHlfaGVpZ2h0KTtcclxufTtcclxuXHJcbnZhciBzZXRFdmVudCA9IGZ1bmN0aW9uICgpIHtcclxuICBjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgfSk7XHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdzZWxlY3RzdGFydCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICB9KTtcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHRvdWNoU3RhcnQoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcbiAgfSk7XHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB0b3VjaE1vdmUoZXZlbnQuY2xpZW50WCwgZXZlbnQuY2xpZW50WSk7XHJcbiAgfSk7XHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdG91Y2hFbmQoKTtcclxuICB9KTtcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB0b3VjaFN0YXJ0KGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCwgZXZlbnQudG91Y2hlc1swXS5jbGllbnRZKTtcclxuICB9KTtcclxuXHJcbiAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHRvdWNoTW92ZShldmVudC50b3VjaGVzWzBdLmNsaWVudFgsIGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSk7XHJcbiAgfSk7XHJcblxyXG4gIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHRvdWNoRW5kKCk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG52YXIgdHJhbnNmb3JtVmVjdG9yMmQgPSBmdW5jdGlvbih2ZWN0b3IpIHtcclxuICB2ZWN0b3IueCA9ICh2ZWN0b3IueCAvIGJvZHlfd2lkdGgpICogMiAtIDE7XHJcbiAgdmVjdG9yLnkgPSAtICh2ZWN0b3IueSAvIGJvZHlfaGVpZ2h0KSAqIDIgKyAxO1xyXG59O1xyXG5cclxudmFyIHRvdWNoU3RhcnQgPSBmdW5jdGlvbih4LCB5KSB7XHJcbiAgdmVjdG9yX21vdXNlX2Rvd24uc2V0KHgsIHkpO1xyXG4gIHRyYW5zZm9ybVZlY3RvcjJkKHZlY3Rvcl9tb3VzZV9kb3duKTtcclxuICBpZiAocnVubmluZy50b3VjaFN0YXJ0KSBydW5uaW5nLnRvdWNoU3RhcnQodmVjdG9yX21vdXNlX2Rvd24pO1xyXG59O1xyXG5cclxudmFyIHRvdWNoTW92ZSA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuICB2ZWN0b3JfbW91c2VfbW92ZS5zZXQoeCwgeSk7XHJcbiAgdHJhbnNmb3JtVmVjdG9yMmQodmVjdG9yX21vdXNlX21vdmUpO1xyXG4gIGlmIChydW5uaW5nLnRvdWNoTW92ZSkgcnVubmluZy50b3VjaE1vdmUodmVjdG9yX21vdXNlX2Rvd24sIHZlY3Rvcl9tb3VzZV9tb3ZlLCBjYW1lcmEpO1xyXG59O1xyXG5cclxudmFyIHRvdWNoRW5kID0gZnVuY3Rpb24oeCwgeSkge1xyXG4gIHZlY3Rvcl9tb3VzZV9lbmQuY29weSh2ZWN0b3JfbW91c2VfbW92ZSk7XHJcbiAgaWYgKHJ1bm5pbmcudG91Y2hFbmQpIHJ1bm5pbmcudG91Y2hFbmQodmVjdG9yX21vdXNlX2VuZCk7XHJcbn07XHJcblxyXG5pbml0KCk7XHJcbiIsInZhciBVdGlsID0gcmVxdWlyZSgnLi4vbW9kdWxlcy91dGlsJyk7XHJcblxyXG52YXIgZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgdmFyIFNrZXRjaCA9IGZ1bmN0aW9uKCkge307XHJcblxyXG4gIFNrZXRjaC5wcm90b3R5cGUgPSB7XHJcbiAgICBpbml0OiBmdW5jdGlvbihzY2VuZSwgY2FtZXJhKSB7XHJcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgxMDAsIDEwMCwgMTAwKTtcclxuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcclxuICAgICAgICBjb2xvcjogMHhmZmZmZmYsXHJcbiAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICAgICAgb3BhY2l0eTogMC40LFxyXG4gICAgICAgIHdpcmVmcmFtZTogdHJ1ZVxyXG4gICAgICB9KTtcclxuICAgICAgdmFyIG9iaiA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XHJcbiAgICAgIG9iai5yb3RhdGlvbi5zZXQoLTAuMiwgLTAuMywgMC4zKTtcclxuICAgICAgc2NlbmUuYWRkKG9iaik7XHJcbiAgICAgIGNhbWVyYS5hbmNob3IgPSBuZXcgVEhSRUUuVmVjdG9yMygzMDAsIDAsIDApO1xyXG4gICAgfSxcclxuICAgIHJlbW92ZTogZnVuY3Rpb24oc2NlbmUpIHtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKGNhbWVyYSkge1xyXG4gICAgICBjYW1lcmEuYXBwbHlIb29rKDAsIDAuMDI1KTtcclxuICAgICAgY2FtZXJhLmFwcGx5RHJhZygwLjIpO1xyXG4gICAgICBjYW1lcmEudXBkYXRlVmVsb2NpdHkoKTtcclxuICAgICAgY2FtZXJhLnVwZGF0ZVBvc2l0aW9uKCk7XHJcbiAgICAgIGNhbWVyYS5sb29rQXRDZW50ZXIoKTtcclxuICAgIH1cclxuICB9O1xyXG4gIHJldHVybiBTa2V0Y2g7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMoKTtcclxuIl19
