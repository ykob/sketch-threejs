import * as THREE from 'three';
import { debounce } from '@ykob/js-util';

import normalizeVector2 from '../../common/normalizeVector2';
import Force3 from '../../old/Force3';
import ForceCamera from '../../old/ForceCamera';
import ForceHemisphereLight from '../../old/ForceHemisphereLight';
import Util from '../../old/util';

export default function() {
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new ForceCamera(35, window.innerWidth / window.innerHeight, 1, 10000);

  //
  // process for this sketch.
  //
  var images = [];
  var images_num = 300;
  var light = null;
  var raycaster = new THREE.Raycaster();
  var picked_id = -1;
  var picked_index = -1;
  var is_clicked = false;
  var is_draged = false;
  var get_near = false;

  var Image = function() {
    this.rad = 0;
    this.obj;
    this.is_entered = false;
    Force3.call(this);
  };
  var image_geometry = new THREE.PlaneGeometry(100, 100);
  Image.prototype = Object.create(Force3.prototype);
  Image.prototype.constructor = Image;
  Image.prototype.init = function(vector) {
    var image_material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      map: new THREE.TextureLoader().load('../img/sketch/gallery/image0' + Util.getRandomInt(1, 9) + '.jpg')
    });

    this.obj = new THREE.Mesh(image_geometry, image_material);
    this.velocity = vector.clone();
    this.anchor = vector.clone();
    this.acceleration.set(0, 0, 0);
  };

  var initImages = function(scene) {
    for (var i = 0; i < images_num; i++) {
      var image = null;
      var rad = Util.getRadian(i % 45 * 8 + 180);
      var radius = 1000;
      var x = Math.cos(rad) * radius;
      var y = i * 5 - images_num * 2.5;
      var z = Math.sin(rad) * radius;
      var vector = new THREE.Vector3(x, y, z);
      image = new Image();
      image.init(new THREE.Vector3());
      image.rad = rad;
      image.obj.position.copy(vector);
      scene.add(image.obj);
      images.push(image);
    }
  };

  var pickImage = function(vector) {
    if (get_near) return;
    var intersects = null;
    raycaster.setFromCamera(vector, camera);
    intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0 && is_draged == false) {
      document.body.classList.add('is-pointed');
      picked_id = intersects[0].object.id;
    } else {
      resetPickImage();
    }
  };

  var getNearImage = function(camera, image) {
    get_near = true;
    camera.force.position.anchor.set(Math.cos(image.rad) * 780, image.obj.position.y, Math.sin(image.rad) * 780);
    camera.force.look.anchor.copy(image.obj.position);
    resetPickImage();
  };

  var resetPickImage = function() {
    document.body.classList.remove('is-pointed');
    picked_id = -1;
  };

  const initSketch = () => {
    initImages(scene);
    light = new ForceHemisphereLight(0xffffff, 0xffffff, 1);
    scene.add(light);
    camera.force.position.anchor.set(0, 0, 0);
    camera.rotate_rad1 = Util.getRadian(-35);
    camera.rotate_rad1_base = camera.rotate_rad1;
    camera.rotate_rad2 = Util.getRadian(180);
    camera.rotate_rad2_base = camera.rotate_rad2;
  }

  //
  // common process
  //
  const resizeWindow = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  const render = () => {
    for (var i = 0; i < images_num; i++) {
      images[i].applyHook(0, 0.14);
      images[i].applyDrag(0.4);
      images[i].updateVelocity();
      images[i].obj.lookAt(0, images[i].obj.position.y, 0);
      if (images[i].obj.id == picked_id && is_draged == false && get_near == false) {
        if (is_clicked == true) {
          picked_index = i;
        } else {
          images[i].obj.material.color.set(0xaaaaaa);
        }
      } else {
        images[i].obj.material.color.set(0xffffff);
      }
    }
    camera.force.position.applyHook(0, 0.08);
    camera.force.position.applyDrag(0.4);
    camera.force.position.updateVelocity();
    camera.updatePosition();
    if (get_near === false) {
      camera.force.look.anchor.copy(Util.getPolarCoord(camera.rotate_rad1, camera.rotate_rad2, 1000));
    }
    camera.force.look.applyHook(0, 0.08);
    camera.force.look.applyDrag(0.4);
    camera.force.look.updateVelocity();
    camera.updateLook();
    renderer.render(scene, camera);
  }
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  }
  const on = () => {
    const vectorTouchStart = new THREE.Vector2();
    const vectorTouchMove = new THREE.Vector2();
    const vectorTouchEnd = new THREE.Vector2();

    const touchStart = (x, y, touch_event) => {
      vectorTouchStart.set(x, y);
      normalizeVector2(vectorTouchStart);
      pickImage(vectorTouchStart);
      is_clicked = true;
    };
    const touchMove = (x, y, touch_event) => {
      vectorTouchMove.set(x, y);
      normalizeVector2(vectorTouchMove);
      pickImage(scene, camera, vectorTouchMove);
      if (is_clicked && vectorTouchStart.clone().sub(vectorTouchMove).length() > 0.01) {
        is_clicked = false;
        is_draged = true;
      }
      if (is_draged == true && get_near == false) {
        camera.rotate_rad1 = camera.rotate_rad1_base + Util.getRadian((vectorTouchStart.y - vectorTouchMove.y) * 50);
        camera.rotate_rad2 = camera.rotate_rad2_base + Util.getRadian((vectorTouchStart.x - vectorTouchMove.x) * 50);
        if (camera.rotate_rad1 < Util.getRadian(-50)) {
          camera.rotate_rad1 = Util.getRadian(-50);
        }
        if (camera.rotate_rad1 > Util.getRadian(50)) {
          camera.rotate_rad1 = Util.getRadian(50);
        }
      }
    };
    const touchEnd = (x, y, touch_event) => {
      vectorTouchEnd.set(x, y);
      resetPickImage();
      if (get_near) {
        camera.force.position.anchor.set(0, 0, 0);
        picked_index = -1;
        get_near = false;
      } else if (is_clicked && picked_index > -1) {
        getNearImage(camera, images[picked_index]);
      } else if (is_draged) {
        camera.rotate_rad1_base = camera.rotate_rad1;
        camera.rotate_rad2_base = camera.rotate_rad2;
      }
      is_clicked = false;
      is_draged = false;
    };
    const mouseOut = () => {
      vectorTouchEnd.set(0, 0);
      resetPickImage();
      if (get_near) {
        camera.force.position.anchor.set(0, 0, 0);
        picked_index = -1;
        get_near = false;
      } else if (is_clicked && picked_index > -1) {
        getNearImage(camera, images[picked_index]);
      } else if (is_draged) {
        camera.rotate_rad1_base = camera.rotate_rad1;
        camera.rotate_rad2_base = camera.rotate_rad2;
      }
      is_clicked = false;
      is_draged = false;
    };

    window.addEventListener('resize', debounce(() => {
      resizeWindow();
    }), 1000);
    canvas.addEventListener('mousedown', function (event) {
      event.preventDefault();
      touchStart(event.clientX, event.clientY, false);
    });
    canvas.addEventListener('mousemove', function (event) {
      event.preventDefault();
      touchMove(event.clientX, event.clientY, false);
    });
    canvas.addEventListener('mouseup', function (event) {
      event.preventDefault();
      touchEnd(event.clientX, event.clientY, false);
    });
    canvas.addEventListener('touchstart', function (event) {
      event.preventDefault();
      touchStart(event.touches[0].clientX, event.touches[0].clientY, true);
    });
    canvas.addEventListener('touchmove', function (event) {
      event.preventDefault();
      touchMove(event.touches[0].clientX, event.touches[0].clientY, true);
    });
    canvas.addEventListener('touchend', function (event) {
      event.preventDefault();
      touchEnd(event.changedTouches[0].clientX, event.changedTouches[0].clientY, true);
    });
    window.addEventListener('mouseout', function () {
      event.preventDefault();
      mouseOut();
    });
  }

  const init = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1.0);
    camera.position.set(1000, 1000, 1000);
    camera.lookAt(new THREE.Vector3());

    on();
    initSketch();
    resizeWindow();
    renderLoop();
  }
  init();
}
