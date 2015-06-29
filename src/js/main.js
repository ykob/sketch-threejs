var Get = require('./get');
var get = new Get();
var debounce = require('./debounce');
var Camera = require('./camera');
var PointLight = require('./pointLight');
var HemiLight = require('./hemiLight');
var Mesh = require('./mesh');

var bodyWidth = document.body.clientWidth;
var bodyHeight = document.body.clientHeight;
var fps = 60;
var frameTime;
var lastTimeRender = +new Date();

var canvas;
var renderer;
var scene;
var camera;
var light;
var globe;
var ball;
var particleArr = [];
var particleNum = 64;

var initThree = function() {
  canvas = document.getElementById('canvas');
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  if (!renderer) {
    alert('Three.jsの初期化に失敗しました。');
  }
  renderer.setSize(bodyWidth, bodyHeight);
  canvas.appendChild(renderer.domElement);
  renderer.setClearColor(0xeeeeee, 1.0);
  
  scene = new THREE.Scene();
};

var init = function() {
  var ballGeometry = new THREE.SphereGeometry(300, 20, 20);
  var ballMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading
  });

  initThree();
  
  camera = new Camera();
  camera.init(get.radian(45), get.radian(0), bodyWidth, bodyHeight);
  
  light = new HemiLight();
  light.init(scene, get.radian(0), get.radian(120), 1000, 0x66ff99, 0x3366aa, 1);
  
  ball = new Mesh();
  ball.init(scene, ballGeometry, ballMaterial);
  
  renderloop();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var render = function() {
  renderer.clear();
  
  ball.updateVertices();
  
  renderer.render(scene, camera.obj);
};

var renderloop = function() {
  var now = +new Date();
  requestAnimationFrame(renderloop);

  if (now - lastTimeRender > 1000 / fps) {
    render();
    lastTimeRender = +new Date();
  }
  camera.trackball.update();
};

var resizeRenderer = function() {
  bodyWidth  = document.body.clientWidth;
  bodyHeight = document.body.clientHeight;
  renderer.setSize(bodyWidth, bodyHeight);
  camera.init(get.radian(45), get.radian(0), bodyWidth, bodyHeight);
};

init();
