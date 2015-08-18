var Util = require('./util');
var util = new Util();
var debounce = require('./debounce');
var Camera = require('./camera');
var PointLight = require('./pointLight');
var HemiLight = require('./hemiLight');
var Mesh = require('./mesh');

var body_width = document.body.clientWidth;
var body_height = document.body.clientHeight;
var fps = 60;
var last_time_render = Date.now();
var raycaster = new THREE.Raycaster();
var mouse_vector = new THREE.Vector2(-2, -2);
var intersects;

var canvas;
var renderer;
var scene;
var camera;
var light;

var hannya_text = '観自在菩薩 行深般若波羅蜜多時 照見五蘊皆空 度一切苦厄 舎利子 色不異空 空不異色 色即是空 空即是色 受想行識亦復如是 舎利子 是諸法空相 不生不滅 不垢不浄 不増不減 是故空中 無色無受想行識 無眼耳鼻舌身意 無色声香味触法 無眼界乃至無意識界 無無明亦無無明尽 乃至無老死 亦無老死尽 無苦集滅道 無智亦無得 以無所得故 菩提薩埵 依般若波羅蜜多故 心無罣礙 無罣礙故 無有恐怖 遠離一切顛倒夢想 究竟涅槃 三世諸仏 依般若波羅蜜多故 得阿耨多羅三藐三菩提 故知般若波羅蜜多 是大神呪 是大明呪 是無上呪 是無等等呪 能除一切苦 真実不虚 故説般若波羅蜜多呪 即説呪日 羯諦羯諦 波羅羯諦 波羅僧羯諦 菩提薩婆訶 般若心経';
var hannya_length = hannya_text.length;
var hannya_col_max = 15;
var hannya_row_max = Math.floor(hannya_length / hannya_col_max);
var hannya_particles = [];
var hannya_geometry = new THREE.Geometry();
var hannya_materials = [];

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
  renderer.setClearColor(0x222222, 1.0);
  
  scene = new THREE.Scene();
  //scene.fog = new THREE.FogExp2( 0x000000, 0.0015);
};

var init = function() {
  initThree();
  
  camera = new Camera();
  camera.init(util.getRadian(30), util.getRadian(30), body_width, body_height);
  
  light = new HemiLight();
  light.init(scene, util.getRadian(30), util.getRadian(60), 1000, 0xeeeeff, 0x777700, 1);
  
  var grid = 50;
  for (var i = 0; i < hannya_length; i++) {
    var row = Math.floor(i / hannya_col_max);
    var col = i % hannya_col_max;
    var vertex = new THREE.Vector3();
    
    vertex.x = col * grid - hannya_col_max * grid / 2;
    vertex.y = 0;
    vertex.z = row * grid - hannya_row_max * grid / 2;
    hannya_geometry.vertices.push(vertex);
    hannya_materials[i] = new THREE.PointCloudMaterial({
      size: 20,
      color: 0xff0000,
      //map: text_image,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent : true
    });
    hannya_particles[i] = new THREE.PointCloud(hannya_geometry, hannya_materials[i]);
    scene.add(hannya_particles[i]);
  }
  
  renderloop();
  setEvent();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var setEvent = function () {
  var mouse_down = new THREE.Vector2();
  var mouse_move = new THREE.Vector2();

  var eventTouchStart = function(x, y) {
    mouse_down.set(x, y);
    mouse_vector.x = (x / window.innerWidth) * 2 - 1;
    mouse_vector.y = - (y / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse_vector, camera.obj);
    intersects = raycaster.intersectObjects(scene.children);
  };
  
  var eventTouchMove = function(x, y) {
    mouse_move.set(x, y);
    mouse_vector.x = (x / window.innerWidth) * 2 - 1;
    mouse_vector.y = - (y / window.innerHeight) * 2 + 1;
  };
  
  var eventTouchEnd = function(x, y) {
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
  for (var i = 0; i < hannya_particles.length; i++) {
  };
  renderer.render(scene, camera.obj);
};

var renderloop = function() {
  var now = Date.now();
  requestAnimationFrame(renderloop);

  if (now - last_time_render > 1000 / fps) {
    render();
    last_time_render = Date.now();
  }
};

var resizeRenderer = function() {
  body_width  = document.body.clientWidth;
  body_height = document.body.clientHeight;
  renderer.setSize(body_width, body_height);
  camera.init(util.getRadian(20), util.getRadian(0), body_width, body_height);
};

init();
