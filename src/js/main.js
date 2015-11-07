var Util = require('./modules/util');
var debounce = require('./modules/debounce');
var Camera = require('./modules/camera');

var body_width = document.body.clientWidth;
var body_height = document.body.clientHeight;
var raycaster = new THREE.Raycaster();
var vector_mouse_down = new THREE.Vector2();
var vector_mouse_move = new THREE.Vector2();
var intersects;

var canvas = null;
var renderer = null;
var scene = null;
var camera = null;

var running = null;
var sketches = {
  dummy: ['dummy', require('./sketches/dummy.js')],
};

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
  
  running = new sketches.dummy[1];
  running.init(scene);
};

var init = function() {
  initThree();
  renderloop();
  setEvent();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var raycast = function(vector) {
  vector.x = (vector.x / window.innerWidth) * 2 - 1;
  vector.y = - (vector.y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(vector, camera.obj);
  intersects = raycaster.intersectObjects(scene.children);
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
  var touchStart = function(x, y) {
    vector_mouse_down.set(x, y);
    raycast(vector_mouse_down);
  };
  
  var touchMove = function(x, y) {
    vector_mouse_move.set(x, y);
    raycast(vector_mouse_move);
  };
  
  var touchEnd = function(x, y) {
  };

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

init();
