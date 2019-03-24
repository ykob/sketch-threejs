require("@babel/polyfill");

const ConsoleSignature = require('./common/ConsoleSignature.js').default;
const redirectOldSketches = require('./common/redirectOldSketches.js').default;

const page = document.querySelector('.l-page');
const pageId = page.dataset.id;
const consoleSignature = new ConsoleSignature();

// running each init functions.
if (pageId == 'index') {
  require('./index/init.js').default();
} else {
  const canvas = document.getElementById('canvas-webgl');
  canvas.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });
  canvas.addEventListener('selectstart', function (event) {
    event.preventDefault();
  });

  switch (pageId) {
    case 'dissolve':    require('./sketch/dissolve/init.js').default(); break;
    case 'dna':         require('./sketch/dna/init.js').default(); break;
    case 'newyear2019': require('./sketch/newyear2019/init.js').default(); break;
    case 'buddha':      require('./sketch/buddha/init.js').default(); break;
    case 'planet':      require('./sketch/planet/init.js').default(); break;
    case 'land':        require('./sketch/land/init.js').default(); break;
    case 'webcam':      require('./sketch/webcam/init.js').default(); break;
    case 'fog':         require('./sketch/fog/init.js').default(); break;
    case 'node_text':   require('./sketch/node_text/init.js').default(); break;
    case 'repel':       require('./sketch/repel/init.js').default(); break;
    case 'flame':       require('./sketch/flame/init.js').default(); break;
    case 'cyberspace':  require('./sketch/cyberspace/init.js').default(); break;
    case 'beam':        require('./sketch/beam/init.js').default(); break;
    case 'blink':       require('./sketch/blink/init.js').default(); break;
    case 'transform':   require('./sketch/transform/init.js').default(); break;
    case 'egg':         require('./sketch/egg/init.js').default(); break;
    case 'butterfly':   require('./sketch/butterfly/init.js').default(); break;
    case 'puddle':      require('./sketch/puddle/init.js').default(); break;
    case 'reel':        require('./sketch/reel/init.js').default(); break;
    case 'glitch':      require('./sketch/glitch/init.js').default(); break;
    case 'instancing':  require('./sketch/instancing/init.js').default(); break;
    case 'particle':    require('./sketch/particle/init.js').default(); break;
    case 'attract':     require('./sketch/attract/init.js').default(); break;
    case 'hole':        require('./sketch/hole/init.js').default(); break;
    case 'metal_cube':  require('./sketch/metal_cube/init.js').default(); break;
    case 'distort':     require('./sketch/distort/init.js').default(); break;
    case 'image_data':  require('./sketch/image_data/init.js').default(); break;
    case 'gallery':     require('./sketch/gallery/init.js').default(); break;
    case 'comet':       require('./sketch/comet/init.js').default(); break;
    case 'hyper_space': require('./sketch/hyper_space/init.js').default(); break;
    case 'fire_ball':   require('./sketch/fire_ball/init.js').default(); break;
    default:
  }
}

// redirect from old sketches url.
redirectOldSketches();
