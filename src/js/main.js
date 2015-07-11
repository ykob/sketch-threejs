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
var raycaster = new THREE.Raycaster();
var mouseVector = new THREE.Vector2(-2, -2);
var intersects;

var canvas;
var renderer;
var scene;
var camera;
var light;
var globe;
var ball;
var particleArr = [];
var particleNum = 64;

var isGlipedBall = false;

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
  var ballGeometry = new THREE.SphereGeometry(120, 60, 60);
  var ballMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff
  });

  initThree();
  
  camera = new Camera();
  camera.init(get.radian(30), get.radian(0), bodyWidth, bodyHeight);
  
  light = new HemiLight();
  light.init(scene, get.radian(30), get.radian(60), 1000, 0xff9999, 0x3366cc, 1);
  
  ball = new Mesh();
  ball.init(scene, ballGeometry, ballMaterial);
  
  renderloop();
  setEvent();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var setEvent = function () {
  var mousedownX = 0;
  var mousedownY = 0;
  var mousemoveX = 0;
  var mousemoveY = 0;

  var eventTouchStart = function(x, y) {
    mousedownX = 0;
    mousedownY = 0;
    mouseVector.x = (x / window.innerWidth) * 2 - 1;
    mouseVector.y = - (y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouseVector, camera.obj);
    intersects = raycaster.intersectObjects(scene.children);
    for (var i = 0; i < intersects.length; i++) {
      if (intersects[i].object.id == ball.id) {
        isGlipedBall = true;
      }
    };
  };
  
  var eventTouchMove = function(x, y) {
    mousemoveX = x;
    mousemoveY = y;
    mouseVector.x = (x / window.innerWidth) * 2 - 1;
    mouseVector.y = - (y / window.innerHeight) * 2 + 1;
  };
  
  var eventTouchEnd = function(x, y) {
    if (isGlipedBall) {
      ball.released();
      isGlipedBall = false;
    }
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
  
  ball.updateVertices();
  if (isGlipedBall) {
    ball.gliped();
  }
  
  renderer.render(scene, camera.obj);
};

var renderloop = function() {
  var now = +new Date();
  render();
  setTimeout(renderloop, 1000 / fps);
};

var resizeRenderer = function() {
  bodyWidth  = document.body.clientWidth;
  bodyHeight = document.body.clientHeight;
  renderer.setSize(bodyWidth, bodyHeight);
  camera.init(get.radian(45), get.radian(0), bodyWidth, bodyHeight);
};

init();
