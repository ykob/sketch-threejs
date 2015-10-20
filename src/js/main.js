var Util = require('./Util');
var debounce = require('./debounce');
var Camera = require('./camera');
var HemiLight = require('./hemiLight');
var Mover = require('./mover');

var body_width = document.body.clientWidth;
var body_height = document.body.clientHeight;
var last_time_activate = Date.now();
var raycaster = new THREE.Raycaster();
var vector_mouse_down = new THREE.Vector2();
var vector_mouse_move = new THREE.Vector2();
var intersects;

var canvas = null;
var renderer = null;
var scene = null;
var camera = null;
var light = null;

var movers_num = 50000;
var movers = [];
var points_geometry = null;
var points_material = null;
var points = null;

var antigravity = new THREE.Vector3(0, 10, 0);

var initThree = function() {
  canvas = document.getElementById('canvas');
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  if (!renderer) {
    alert('Three.jsの初期化に失敗しました。');
  }
  renderer.setSize(body_width, body_height);
  canvas.appendChild(renderer.domElement);
  renderer.setClearColor(0x111111, 1.0);
  
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 800, 1600);
  
  camera = new Camera();
  camera.init(body_width, body_height);
  
  light = new HemiLight();
  light.init(scene, Util.getRadian(30), Util.getRadian(60), 1000, 0x77ffaa, 0x77ffaa, 1);
  
  // var dummy_geometry = new THREE.BoxGeometry(100, 100, 100);
  // var dummy_material = new THREE.MeshLambertMaterial({
  //   color: 0xffffff
  // });
  // var dummy_obj = new THREE.Mesh(dummy_geometry, dummy_material);
  // scene.add(dummy_obj);
};

var init = function() {
  initThree();
  buildPoints();
  renderloop();
  setEvent();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var activateMover = function () {
  var count = 0;

  for (var i = 0; i < movers.length; i++) {
    var mover = movers[i];
    
    if (mover.is_active) continue;
    mover.activate();
    mover.velocity.y = -300;
    count++;
    if (count >= 50) break;
  }
};

var buildPoints = function() {
  points_geometry = new THREE.Geometry();
  points_material = new THREE.PointsMaterial({
    color: 0xffffcc,
    size: 40,
    transparent: true,
    opacity: 0.5,
    map: THREE.ImageUtils.loadTexture('/img/particle001.png'),
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  points_geometry2 = new THREE.Geometry();
  points_material2 = new THREE.PointsMaterial({
    color: 0xffaaaa,
    size: 40,
    transparent: true,
    opacity: 0.5,
    map: THREE.ImageUtils.loadTexture('/img/particle001.png'),
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  for (var i = 0; i < movers_num; i++) {
    var mover = new Mover();
    var range = Math.log(Util.getRandomInt(2, 256)) / Math.log(256) * 300 + 50;
    var rad = Util.getRadian(Util.getRandomInt(0, 36000) / 100);
    var x = Math.cos(rad) * range;
    var z = Math.sin(rad) * range;
    mover.init(new THREE.Vector3(x, 1000, z));
    mover.mass = Util.getRandomInt(300, 500) / 100;
    movers.push(mover);
    if (i % 2 === 0) {
      points_geometry.vertices.push(mover.position);
    } else {
      points_geometry2.vertices.push(mover.position);
    }
  }
  points = new THREE.Points(points_geometry, points_material);
  points2 = new THREE.Points(points_geometry2, points_material2);
  scene.add(points);
  scene.add(points2);
};

var updatePoints = function() {
  var points_vertices = [];
  var points_vertices2 = [];
  for (var i = 0; i < movers.length; i++) {
    var mover = movers[i];
    if (mover.is_active) {
      mover.applyForce(antigravity);
      mover.updateVelocity();
      mover.updatePosition();
      if (mover.position.y > 1000) {
        var range = Math.log(Util.getRandomInt(2, 256)) / Math.log(256) * 300 + 50;
        var rad = Util.getRadian(Util.getRandomInt(0, 36000) / 100);
        var x = Math.cos(rad) * range;
        var z = Math.sin(rad) * range;
        mover.init(new THREE.Vector3(x, -300, z));
        mover.mass = Util.getRandomInt(300, 500) / 100;
      }
    }
    if (i % 2 === 0) {
      points_vertices.push(mover.position);
    } else {
      points_vertices2.push(mover.position);
    }
  }
  points.geometry.vertices = points_vertices;
  points.geometry.verticesNeedUpdate = true;
  points2.geometry.vertices = points_vertices2;
  points2.geometry.verticesNeedUpdate = true;
};

var rotateCamera = function() {
  camera.rad2 += Util.getRadian(0.1);
  camera.reset();
}

var raycast = function(vector) {
  vector.x = (vector.x / window.innerWidth) * 2 - 1;
  vector.y = - (vector.y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(vector, camera.obj);
  intersects = raycaster.intersectObjects(scene.children);
};

var setEvent = function () {
  var touchStart = function(x, y) {
    vector_mouse_down.set(x, y);
    raycast(vector_mouse_down);
  };
  
  var touchMove = function(x, y) {
    vector_mouse_move.set(x, y);
    raycast(vector_mouse_move);
  };
  
  var touchEnd = function(x, y) {
  };

  canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });

  canvas.addEventListener('selectstart', function (event) {
    event.preventDefault();
  });

  canvas.addEventListener('mousedown', function (event) {
    event.preventDefault();
    touchStart(event.clientX, event.clientY);
  });

  canvas.addEventListener('mousemove', function (event) {
    event.preventDefault();
    touchMove(event.clientX, event.clientY);
  });

  canvas.addEventListener('mouseup', function (event) {
    event.preventDefault();
    touchEnd();
  });

  canvas.addEventListener('touchstart', function (event) {
    event.preventDefault();
    touchStart(event.touches[0].clientX, event.touches[0].clientY);
  });

  canvas.addEventListener('touchmove', function (event) {
    event.preventDefault();
    touchMove(event.touches[0].clientX, event.touches[0].clientY);
  });

  canvas.addEventListener('touchend', function (event) {
    event.preventDefault();
    touchEnd();
  });
};

var render = function() {
  renderer.clear();
  updatePoints();
  rotateCamera();
  renderer.render(scene, camera.obj);
};

var renderloop = function() {
  var now = Date.now();
  requestAnimationFrame(renderloop);
  render();
  if (now - last_time_activate > 10) {
    activateMover();
    last_time_activate = Date.now();
  }
};

var resizeRenderer = function() {
  body_width  = document.body.clientWidth;
  body_height = document.body.clientHeight;
  renderer.setSize(body_width, body_height);
  camera.resize(body_width, body_height);
};

init();
