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
  
  for (var i = 0; i < 200; i++) {
    boxObjArr[i] = new boxObj();
    boxObjArr[i].setPosition();
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
  
  // trackball = new THREE.TrackballControls(camera, canvas);
  // trackball.screen.width = bodyWidth;
  // trackball.screen.height = bodyHeight;
  // trackball.noRotate = false;
  // trackball.rotateSpeed = 3;
  // trackball.noZoom = false;
  // trackball.zoomSpeed = 1;
  // trackball.noPan = true;
};

var initLight = function() {
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  pointLight = new THREE.PointLight(0xffffff, 1);
  spotLight = new THREE.SpotLight(0xffffff, 1, 200, getRadian(10));
  hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  ambientLight = new THREE.AmbientLight(0x111111);

  directionalLight.position.set(300, 200, 400);
  pointLight.position.set(20, 20, 30);
  spotLight.position.set(40, 40, 100);
  hemisphereLight.position.set(50, 20, 70);
  
  directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
  pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  spotLightHelper = new THREE.SpotLightHelper(spotLight, 1);
  hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1);
  
  scene.add(pointLight);
  scene.add(ambientLight);
};

var boxObj = function() {
  this.size = 24;
  this.angle = getRadian(getRandomInt(0, 360));
  this.angle2 = getRadian(getRandomInt(0, 360));
  this.r = 200;
  this.x = Math.cos(this.angle) * Math.cos(this.angle2) * this.r;
  this.y = Math.cos(this.angle) * Math.sin(this.angle2) * this.r;
  this.z = Math.sin(this.angle) * this.r;
  this.rotateX = this.angle;
  this.rotateY = this.angle;
  this.rotateZ = this.angle;

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
    boxObjArr[i].setRotation();
  };
  renderer.render(scene, camera);
  //trackball.update();
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

threeStart();
