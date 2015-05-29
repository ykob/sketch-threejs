var lastTimeRender;
var renderer;
var scene;
var canvas;
var camera;
var trackball;
var hemiLight;

var planeObjArr = [];
var planeNumAll = 360;
var vectorCenter = new THREE.Vector3(0, 0, 0);

var threeStart = function() {
  initThree();
  initCamera();
  initLight();
  
  var radUnit = 360 / planeNumAll;
  
  for (var i = 0; i < planeNumAll; i++) {
    planeObjArr[i] = new Plane();
    planeObjArr[i].init();
    planeObjArr[i].rad1Base = getRadian(radUnit * i );
    planeObjArr[i].rad2Base = getRadian(radUnit * i * 24);
  }
  
  renderloop();
};

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

var initCamera = function() {
  camera = new THREE.PerspectiveCamera(45, bodyWidth / bodyHeight, 1, 10000);
  camera.position.set(500, 500, 500);
  camera.up.set(0, 1, 0);
  camera.lookAt({
    x: 0,
    y: 0,
    z: 0
  });
  
  trackball = new THREE.TrackballControls(camera, canvas);
  trackball.screen.width = bodyWidth;
  trackball.screen.height = bodyHeight;
  trackball.noRotate = false;
  trackball.rotateSpeed = 3;
  trackball.noZoom = false;
  trackball.zoomSpeed = 1;
  trackball.noPan = true;
};

var initLight = function() {
  var colorArr = [0xDE6641, 0xE8AC51, 0xF2E55C, 0x39A869, 0x4784BF, 0x5D5099, 0xA55B9A];
  var colorNum = colorArr.length;
  var degUnit  = 360 / colorNum;
  
  for (var i = 0; i < colorNum; i++) {
    var rad = getRadian(0);
    var rad2 = getRadian(degUnit * i);
    var x = Math.cos(rad) * Math.cos(rad2) * 5000;
    var y = Math.cos(rad) * Math.sin(rad2) * 5000;
    var z = Math.sin(rad) * 5000;
    var light = new THREE.PointLight(colorArr[i], 0.7);
    console.log(i);
    light.position.set(x, y, z);
    scene.add(light);
  };

  // hemiLight = new THREE.HemisphereLight(0xffffff, 0x666666, 0.2);
  // hemiLight.position.set(x, y, z);
  // scene.add(hemiLight);
};

var Plane = function() {
  this.rad1Base = 0;
  this.rad1 = 0;
  this.rad2Base = 0;
  this.rad2 = 0;
  this.r = 240;
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.up = new THREE.Vector3(0, 1, 0);
  this.q = new THREE.Quaternion();
  
  this.mesh = new THREE.Mesh(this.geometry, this.material);
};

var planeGeometry = new THREE.BoxGeometry(30, 1, 30);

var planeMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff
});

Plane.prototype.init = function() {
  this.mesh = new THREE.Mesh(planeGeometry, planeMaterial);
  this.rad1Base = 0;
  this.rad1 = 0;
  this.rad2Base = 0;
  this.rad2 = 0;
  this.changePosition();
  scene.add(this.mesh);
};

Plane.prototype.changePosition = function() {
  this.x = Math.cos(this.rad1) * Math.cos(this.rad2) * this.r;
  this.y = Math.cos(this.rad1) * Math.sin(this.rad2) * this.r;
  this.z = Math.sin(this.rad1) * this.r;
  this.mesh.position.set(this.x, this.y, this.z);
};

Plane.prototype.changeRotation = function() {
  var up = this.mesh.up;
  var dir = new THREE.Vector3().subVectors(vectorCenter, this.mesh.position).normalize();
  var cross = new THREE.Vector3().crossVectors(up, dir).normalize();
  var dot = up.dot(dir);
  var rad = Math.acos(dot);
  var q = new THREE.Quaternion().setFromAxisAngle(cross, rad);
  this.mesh.rotation.setFromQuaternion(q);
};

var render = function() {
  renderer.clear();
  for (var i = 0; i < planeObjArr.length; i++) {
    planeObjArr[i].rad1Base += getRadian(0.5);
    planeObjArr[i].rad2Base += getRadian(0.5);
    planeObjArr[i].rad1 = planeObjArr[i].rad1Base;
    planeObjArr[i].rad2 = planeObjArr[i].rad2Base;
    planeObjArr[i].changePosition();
    planeObjArr[i].changeRotation();
  };
  renderer.render(scene, camera);
  trackball.update();
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
  console.log(renderer);
  renderer.setSize(bodyWidth, bodyHeight);
  initCamera();
};

debounce(window, 'resize', function(event){
  resizeRenderer();
});

threeStart();
