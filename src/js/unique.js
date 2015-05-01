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
var axis;
var box;

var threeStart = function() {
  initThree();
  initCamera();
  initObject();
  initLight();
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
  camera.position.set(100, 100, 100);
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
  trackball.rotateSpeed = 4;
  trackball.noZoom = false;
  trackball.zoomSpeed = 1;
  trackball.noPan = true;
};

var initLight = function() {
  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  pointLight = new THREE.PointLight(0xffffff, 1);
  spotLight = new THREE.SpotLight(0xffffff, 1, 200, getRadian(10));
  hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
  ambientLight = new THREE.AmbientLight(0xffffff);

  directionalLight.position.set(60, 60, 90);
  pointLight.position.set(20, 20, 30);
  spotLight.position.set(40, 40, 100);
  hemisphereLight.position.set(50, 20, 70);
  
  directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1);
  pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  spotLightHelper = new THREE.SpotLightHelper(spotLight, 1);
  hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 1);
  
  scene.add(spotLight);
  scene.add(spotLightHelper);
};

var initObject = function() {
  var geometry;
  var material;
  
  axis = new THREE.AxisHelper(50);
  axis.position.set(0, 0, 0);
  
  geometry = new THREE.BoxGeometry(20, 20, 20);
  material = new THREE.MeshLambertMaterial({
    color: 0xff0000
  });
  box = new THREE.Mesh(geometry, material);
  axis.position.set(0, 0, 0);

  scene.add(axis);
  scene.add(box);
};

var render = function() {
  renderer.clear();
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

threeStart();
