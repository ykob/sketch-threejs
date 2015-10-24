var Util = require('./Util');
var debounce = require('./debounce');
var Camera = require('./camera');
var HemiLight = require('./hemiLight');
var Points = require('./points');

var body_width = document.body.clientWidth;
var body_height = document.body.clientHeight;
var last_time_activate = Date.now();
var raycaster = new THREE.Raycaster();
var vector_mouse_down = new THREE.Vector2();
var vector_mouse_move = new THREE.Vector2();
var intersects;

var canvas = null;
var renderer = null;
var scene = null;
var camera = null;
var light = null;
var points = null;

var textplate_geometry = null;
var textplate_material = null;
var textplate = null;

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
  scene.fog = new THREE.Fog(0x000000, 800, 1600);
  
  camera = new Camera();
  camera.init(body_width, body_height);
  
  light = new HemiLight();
  light.init(0xffff99, 0x99ffcc);
  scene.add(light.obj);
  
  points = new Points();
  points.init();
  scene.add(points.obj);
  
  // var dummy_geometry = new THREE.BoxGeometry(100, 100, 100);
  // var dummy_material = new THREE.MeshLambertMaterial({
  //   color: 0xffffff
  // });
  // var dummy_obj = new THREE.Mesh(dummy_geometry, dummy_material);
  // scene.add(dummy_obj);
};

var init = function() {
  initThree();
  buildTextPlate();
  renderloop();
  setEvent();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var buildTextPlate = function() {
  var str = 'three.js Points';
  var tx_canvas = document.createElement('canvas');
  var tx_ctx = tx_canvas.getContext('2d');
  var tx_grad = null;
  var texture = null;
  tx_canvas.width = 1000;
  tx_canvas.height = 1000;
  tx_ctx.fillStyle = 'rgb(255, 255, 255)';
  tx_ctx.font = 'bold 80px "source code pro"';
  tx_ctx.textAlign = "center";
  tx_ctx.fillText(str, 500, 500);
  tx_ctx.fill();
  texture = new THREE.Texture(tx_canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.needsUpdate = true;
  textplate_geometry = new THREE.PlaneGeometry(300, 300, 32);
  textplate_material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    map: texture,
    transparent: true
  });
  textplate = new THREE.Mesh(textplate_geometry, textplate_material);
  textplate.position.y = 200;
  textplate.rotation.set(Util.getRadian(-90), 0, Util.getRadian(90));
  scene.add(textplate);
};

var rotateTextPlate = function() {
  textplate.rotation.x += 0.001;
  textplate.rotation.y += 0.002;
  textplate.rotation.z += 0.001;
};

var rotateCamera = function() {
  camera.rad2 += Util.getRadian(0.1);
  camera.reset();
};

var raycast = function(vector) {
  vector.x = (vector.x / window.innerWidth) * 2 - 1;
  vector.y = - (vector.y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(vector, camera.obj);
  intersects = raycaster.intersectObjects(scene.children);
};

var render = function() {
  renderer.clear();
  points.update();
  rotateTextPlate();
  //rotateCamera();
  renderer.render(scene, camera.obj);
};

var renderloop = function() {
  var now = Date.now();
  requestAnimationFrame(renderloop);
  render();
  if (now - last_time_activate > 10) {
    points.activateMover();
    last_time_activate = Date.now();
  }
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
