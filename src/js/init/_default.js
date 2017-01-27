export default function() {
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, document.body.clientWidth / window.innerHeight, 1, 10000);
  const clock = new THREE.Clock();

  //
  // process for this sketch.
  //



  //
  // common process
  //
  const resizeWindow = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    camera.aspect = document.body.clientWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.body.clientWidth, window.innerHeight);
  }
  const render = () => {
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

    const transformVector2d = (vector) => {
      vector.x = (vector.x / document.body.clientWidth) * 2 - 1;
      vector.y = - (vector.y / window.innerHeight) * 2 + 1;
    };
    const touchStart = (x, y, touch_event) => {
      vectorTouchStart.set(x, y);
      transformVector2d(vectorTouchStart);
    };
    const touchMove = (x, y, touch_event) => {
      vectorTouchMove.set(x, y);
      transformVector2d(vectorTouchMove);
    };
    const touchEnd = (x, y, touch_event) => {
      vectorTouchEnd.set(x, y);
    };
    const mouseOut = () => {
      vectorTouchEnd.set(0, 0);
    };

    window.addEventListener('resize', () => {
      resizeWindow();
    })
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
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setClearColor(0xeeeeee, 1.0);
    camera.position.set(1000, 1000, 1000);
    camera.lookAt(new THREE.Vector3());

    on();
    resizeWindow();
    renderLoop();
  }
  init();
}
