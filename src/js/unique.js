window.addEventListener('load', function() {
  threeStart();
}, false);

var threeStart = function() {
  initThree();
  initCamera();
  initObject();
  draw();
};

var renderer;
var scene;
var canvasFrame;

var initThree = function() {
  canvasFrame = document.getElementById('canvas');
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  if (!renderer) {
    alert('Three.jsの初期化に失敗しました。');
  }
  renderer.setSize(bodyWidth, bodyHeight);
  canvasFrame.appendChild(renderer.domElement);
  renderer.setClearColor(0x000000, 1.0);
  scene = new THREE.Scene();
};

var camera;

var initCamera = function() {
  camera = new THREE.PerspectiveCamera(45, bodyWidth / bodyHeight, 1, 10000);
  camera.position.set(50, 50, 100);
  camera.up.set(0, 0, 1);
  camera.lookAt({
    x: 0,
    y: 0,
    z: 0
  })
};

var axis;

var initObject = function() {
  axis = new THREE.AxisHelper(50);
  scene.add(axis);
  axis.position.set(0, 0, 0);
};

var draw = function() {
  renderer.clear();
  renderer.render(scene, camera);
};
