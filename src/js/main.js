var Util = require('./util');
var util = new Util();
var debounce = require('./debounce');
var Camera = require('./camera');
var PointLight = require('./pointLight');
var HemiLight = require('./hemiLight');
var Mesh = require('./mesh');

var body_width = document.body.clientWidth;
var body_height = document.body.clientHeight;
var fps = 60;
var last_time_render = Date.now();
var raycaster = new THREE.Raycaster();
var mouse_vector = new THREE.Vector2(-2, -2);
var intersects;

var canvas;
var renderer;
var scene;
var camera;
var light;

var controls;

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
  renderer.setClearColor(0xffffff, 1.0);
  
  scene = new THREE.Scene();
  //scene.fog = new THREE.FogExp2(0x000000, 2000);
};

var init = function() {
  initThree();
  
  camera = new Camera();
  camera.init(util.getRadian(60), util.getRadian(30), body_width, body_height);
  
  light = new HemiLight();
  light.init(scene, util.getRadian(30), util.getRadian(60), 1000, 0xeeeeff, 0x777700, 1);
  
  renderloop();
  setEvent();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var setEvent = function () {
  var mouse_down = new THREE.Vector2();
  var mouse_move = new THREE.Vector2();

  var eventTouchStart = function(x, y) {
    mouse_down.set(x, y);
    mouse_vector.x = (x / window.innerWidth) * 2 - 1;
    mouse_vector.y = - (y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse_vector, camera.obj);
    intersects = raycaster.intersectObjects(scene.children);
  };
  
  var eventTouchMove = function(x, y) {
    mouse_move.set(x, y);
    mouse_vector.x = (x / window.innerWidth) * 2 - 1;
    mouse_vector.y = - (y / window.innerHeight) * 2 + 1;
  };
  
  var eventTouchEnd = function(x, y) {
  };

  canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });

  canvas.addEventListener('selectstart', function (event) {
    event.preventDefault();
  });

  canvas.addEventListener('mousedown', function (event) {
    event.preventDefault();
    eventTouchStart(event.clientX, event.clientY);
  });

  canvas.addEventListener('mousemove', function (event) {
    event.preventDefault();
    eventTouchMove(event.clientX, event.clientY);
  });

  canvas.addEventListener('mouseup', function (event) {
    event.preventDefault();
    eventTouchEnd();
  });

  canvas.addEventListener('touchstart', function (event) {
    event.preventDefault();
    eventTouchStart(event.touches[0].clientX, event.touches[0].clientY);
  });

  canvas.addEventListener('touchmove', function (event) {
    event.preventDefault();
    eventTouchMove(event.touches[0].clientX, event.touches[0].clientY);
  });

  canvas.addEventListener('touchend', function (event) {
    event.preventDefault();
    eventTouchEnd();
  });
};

var render = function() {
  renderer.clear();
  controls.update(); 
  renderer.render(scene, camera.obj);
};

var renderloop = function() {
  var now = Date.now();
  requestAnimationFrame(renderloop);

  if (now - last_time_render > 1000 / fps) {
    render();
    last_time_render = Date.now();
  }
};

var resizeRenderer = function() {
  body_width  = document.body.clientWidth;
  body_height = document.body.clientHeight;
  renderer.setSize(body_width, body_height);
  camera.init(util.getRadian(60), util.getRadian(30), body_width, body_height);
};

init();
