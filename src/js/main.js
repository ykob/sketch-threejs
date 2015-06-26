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
  var ballGeometry = new THREE.SphereGeometry(240, 24, 24);
  var ballMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    shading: THREE.FlatShading,
    side: THREE.DoubleSide
  });
  var baseGeometry = new THREE.Geometry();
  
  var p = [];
  var r = 100;
  
  p[0] = new THREE.Vector3(r * -1, r, r * -1);
  p[1] = new THREE.Vector3(r * -1, r, r);
  p[2] = new THREE.Vector3(r, r, r);
  p[3] = new THREE.Vector3(r, r, r * -1);
  p[4] = new THREE.Vector3(r * -1, r * -1, r * -1);
  p[5] = new THREE.Vector3(r * -1, r * -1, r);
  p[6] = new THREE.Vector3(r, r * -1, r);
  p[7] = new THREE.Vector3(r, r * -1, r * -1);

  for (var i = 0; i < p.length; i++) {
    baseGeometry.vertices.push(p[i]);
  };
  baseGeometry.faces.push( new THREE.Face3(0, 1, 3));
  baseGeometry.faces.push( new THREE.Face3(2, 3, 1));
  baseGeometry.faces.push( new THREE.Face3(0, 4, 1));
  baseGeometry.faces.push( new THREE.Face3(5, 1, 4));
  baseGeometry.faces.push( new THREE.Face3(0, 3, 4));
  baseGeometry.faces.push( new THREE.Face3(7, 4, 3));
  baseGeometry.faces.push( new THREE.Face3(3, 2, 7));
  baseGeometry.faces.push( new THREE.Face3(6, 7, 2));
  baseGeometry.faces.push( new THREE.Face3(2, 1, 6));
  baseGeometry.faces.push( new THREE.Face3(5, 6, 1));
  baseGeometry.faces.push( new THREE.Face3(4, 7, 5));
  baseGeometry.faces.push( new THREE.Face3(6, 5, 7));
  baseGeometry.computeFaceNormals();
  baseGeometry.computeVertexNormals();

  initThree();
  
  camera = new Camera();
  camera.init(bodyWidth, bodyHeight);
  
  light = new HemiLight();
  light.init(scene, get.radian(45), get.radian(45), 1000, 0xeeeeee, 0x999999, 1);
  
  ball = new Mesh();
  ball.init(scene, baseGeometry, ballMaterial);
  
  p[0].normalize().multiplyScalar(r * 3);
  baseGeometry.computeFaceNormals();
  baseGeometry.computeVertexNormals();
  
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
