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
var sketches = [
  { name: 'hyper space', obj: require('./sketches/dummy2')},
  { name: 'comet', obj: require('./sketches/dummy3')},
  { name: 'fire ball',  obj: require('./sketches/dummy')}
];

var btn_toggle_menu = document.querySelector('.btn-switch-menu');
var menu = document.querySelector('.menu');
var select_sketch = document.querySelector('.select-sketch');

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
  
  running = new sketches[0].obj;
  running.init(scene);
};

var init = function() {
  buildMenu();
  initThree();
  renderloop();
  setEvent();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var buildMenu = function() {
  var sketch_instance = [];
  for (var i = 0; i < sketches.length; i++) {
    var sketch = sketches[i];
    var dom = document.createElement('li');
    dom.setAttribute('data-index', i);
    sketch_instance[i] = sketch.obj;
    dom.innerHTML = '<span>' + sketch.name + '</span>';
    dom.addEventListener('click', function() {
      var index = this.getAttribute('data-index');
      switchSketch(sketch_instance[index]);
    });
    select_sketch.appendChild(dom);
  }
};

var switchSketch = function(sketch) {
  running.remove(scene);
  running = new sketch;
  running.init(scene);
  switchMenu();
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
  
  btn_toggle_menu.addEventListener('click', function(event) {
    event.preventDefault();
    switchMenu();
  });
};

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

var switchMenu = function() {
  btn_toggle_menu.classList.toggle('is-active');
  menu.classList.toggle('is-active');
};

init();
