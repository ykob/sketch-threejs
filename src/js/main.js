var Get = require('./get');
var get = new Get();
var debounce = require('./debounce');
var Camera = require('./camera');
var PointLight = require('./pointLight');
var Globe = require('./globe');
var Ball = require('./ball');
var Particle = require('./particle');

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
  renderer.setClearColor(0x111111, 1.0);
  
  scene = new THREE.Scene();
};

var init = function() {
  var ballGeometry = new THREE.SphereGeometry(120, 24);
  var ballMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    opacity: 0.8,
    transparent: true
  });
  var baseGeometry = new THREE.BoxGeometry(1, 1, 1);
  var baseMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
  
  initThree();
  
  camera = new Camera();
  camera.init(bodyWidth, bodyHeight);
  
  light = new PointLight();
  light.init(scene, get.radian(90), 0, 1000, 0xffffff, 1, 10000);
  
  globe = new Globe();
  globe.init(scene);
  
  ball = new Ball();
  ball.init(scene, ballGeometry, ballMaterial);
  
  for (var i = 0; i < particleNum; i++) {
    particleArr[i] = new Particle();
    particleArr[i].init(scene, baseGeometry, baseMaterial, i, particleNum);
  };
  
  renderloop();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var render = function() {
  renderer.clear();
  
  for (var i = 0; i < particleArr.length; i++) {
    particleArr[i].rad1Base += get.radian(1);
    particleArr[i].rad2Base += get.radian(2);
    particleArr[i].move();
    particleArr[i].setPosition();
    particleArr[i].setRotation();
  };
  
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
  camera.init(bodyWidth, bodyHeight);
};

init();
