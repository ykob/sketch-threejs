import ConsoleSignature from './modules/common/ConsoleSignature.js';
import redirectOldSketches from './modules/common/redirectOldSketches.js';

const page = document.querySelector('.l-page');
const pageId = page.dataset.id;
const consoleSignature = new ConsoleSignature();

const init = () => {
  require('./init/common.js').default();
  if (pageId == 'index') {
    require('./init/index.js').default();
  } else {
    require('./init/commonSketch.js').default();
    switch (pageId) {
      case 'blink':       require('./init/blink.js').default(); break;
      case 'transform':   require('./init/transform.js').default(); break;
      case 'egg':         require('./init/egg.js').default(); break;
      case 'butterfly':   require('./init/butterfly.js').default(); break;
      case 'puddle':      require('./init/puddle.js').default(); break;
      case 'reel':        require('./init/reel.js').default(); break;
      case 'glitch':      require('./init/glitch.js').default(); break;
      case 'instancing':  require('./init/instancing.js').default(); break;
      case 'particle':    require('./init/particle.js').default(); break;
      case 'attract':     require('./init/attract.js').default(); break;
      case 'hole':        require('./init/hole.js').default(); break;
      case 'metal_cube':  require('./init/metalCube.js').default(); break;
      case 'distort':     require('./init/distort.js').default(); break;
      case 'image_data':  require('./init/imageData.js').default(); break;
      case 'gallery':     require('./init/gallery.js').default(); break;
      case 'comet':       require('./init/comet.js').default(); break;
      case 'hyper_space': require('./init/hyperSpace.js').default(); break;
      case 'fire_ball':   require('./init/fireBall.js').default(); break;
      default:
    }
  }
  redirectOldSketches();
}

init();
