var lastTimeRender;
var renderer;
var scene;
var canvas;
var camera;
var trackball;

var directionalLight;
var pointLight;
var spotLight;
var hemisphereLight;
var ambientLight;
var directionalLightHelper;
var pointLightHelper;
var spotLightHelper;
var hemisphereLightHelper;

var boxObjArr = [];

var threeStart = function() {
  initThree();
  initCamera();
  initLight();
  
  for (var i = 0; i < 128; i++) {
    boxObjArr[i] = new boxObj();
    boxObjArr[i].angle = getRadian(i * 16);
    boxObjArr[i].angle2 = getRadian(Math.floor(i / 10) * 20);
    boxObjArr[i].changePositionVal();
    boxObjArr[i].setPosition();
    boxObjArr[i].changeRotationVal();
    boxObjArr[i].setRotation();
    scene.add(boxObjArr[i].mesh);
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
  renderer.setClearColor(0x000000, 1.0);
  scene = new THREE.Scene();
};

var initCamera = function() {
  camera = new THREE.PerspectiveCamera(45, bodyWidth / bodyHeight, 1, 10000);
  camera.position.set(500, 500, 500);
  camera.up.set(0, 0, 1);
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
  // directionalLight = new THREE.DirectionalLight(0xffffff, 1):
  // directionalLight.position.set(300, 200, 400);
  // directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
  
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(0, 0, 0);
  pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  
  // spotLight = new THREE.SpotLight(0xffffff, 1, 200, getRadian(10));
  // spotLight.position.set(40, 40, 100);
  // spotLightHelper = new THREE.SpotLightHelper(spotLight, 1);
  
  // hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  // hemisphereLight.position.set(50, 20, 70);
  // hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1);
  
  ambientLight = new THREE.AmbientLight(0x111111);
  
  scene.add(pointLight);
  scene.add(ambientLight);
  
  var pointLightSphere = new lightSphereObj();
  pointLightSphere.setPosition();
  scene.add(pointLightSphere.mesh);
};

var lightSphereObj = function() {
  this.r = 50;
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.segments = 24;
  this.geometry = new THREE.SphereGeometry(this.r, this.segments);
  this.material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    opacity: 0.9,
    transparent: true
  });
  this.mesh = new THREE.Mesh(this.geometry, this.material);
};

lightSphereObj.prototype.setPosition = function() {
  this.mesh.position.set(this.x, this.y, this.z);
};

var boxObj = function() {
  this.size = getRandomInt(8, 36);
  this.angle = 0;
  this.angle2 = 0;
  this.r = 240;
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.rotateX = 0;
  this.rotateY = 0;
  this.rotateZ = 0;
  
  this.geometry = new THREE.BoxGeometry(this.size, this.size, this.size);
  this.material = new THREE.MeshLambertMaterial({
    color: 0xffffff
  });
  this.mesh = new THREE.Mesh(this.geometry, this.material);
};

boxObj.prototype.changePositionVal = function() {
  this.x = Math.cos(this.angle) * Math.cos(this.angle2) * this.r;
  this.y = Math.cos(this.angle) * Math.sin(this.angle2) * this.r;
  this.z = Math.sin(this.angle) * this.r;
};

boxObj.prototype.setPosition = function() {
  this.mesh.position.set(this.x, this.y, this.z);
};

boxObj.prototype.changeRotationVal = function() {
  this.rotateX = this.angle * 2;
  this.rotateY = this.angle * 2;
  this.rotateZ = this.angle2 * 2;
};

boxObj.prototype.setRotation = function() {
  this.mesh.rotation.set(this.rotateX, this.rotateY, this.rotateZ);
};


var render = function() {
  renderer.clear();
  for (var i = 0; i < boxObjArr.length; i++) {
    boxObjArr[i].angle += getRadian(0.5);
    boxObjArr[i].angle2 += getRadian(0.5);
    boxObjArr[i].changePositionVal();
    boxObjArr[i].setPosition();
    boxObjArr[i].changeRotationVal();
    boxObjArr[i].setRotation();
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
