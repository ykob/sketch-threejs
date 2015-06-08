var Get = require('./get');
var debounce = require('./debounce');
var Camera = require('./camera');
var HemiLight = require('./hemiLight');
var Globe = require('./globe');

var get = new Get();

var bodyWidth = document.body.clientWidth;
var bodyHeight = document.body.clientHeight;
var fps = 60;
var frameTime = 1000 / this.fps;
var lastTimeRender;

var canvas;
var renderer;
var scene;
var camera;
var light;
var globe;

var init = function() {
  canvas = document.getElementById('canvas');
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  if (!renderer) {
    alert('Three.jsの初期化に失敗しました。');
  }
  renderer.setSize(bodyWidth, bodyHeight);
  canvas.appendChild(renderer.domElement);
  renderer.setClearColor(0x111111, 1.0);
  
  scene = new THREE.Scene();
  
  camera = new Camera();
  camera.init(bodyWidth, bodyHeight, 45, 45, 800);
  
  light = new HemiLight();
  light.init(scene, 45, 45, 800, 0xffffff, 0xffffff, 1);
  
  globe = new Globe();
  globe.init(scene);
  
  renderloop();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var render = function() {
  renderer.clear();
  
  renderer.render(scene, camera.obj);
  camera.trackball.update();
};

var renderloop = function() {
  var now = +new Date();
  requestAnimationFrame(renderloop);

  if (now - lastTimeRender < frameTime) {
    return;
  }
  render();
  lastTimeRender = +new Date();
};

var resizeRenderer = function() {
  bodyWidth  = document.body.clientWidth;
  bodyHeight = document.body.clientHeight;
  renderer.setSize(bodyWidth, bodyHeight);
  camera.init(bodyWidth, bodyHeight, 45, 45, 800);
};

init();
