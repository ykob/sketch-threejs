import initCommon from './init/common.js'
import initCommonSketch from './init/commonSketch.js'
import initIndex from './init/index.js'

// initialize function for sketches
import initPuddle from './init/puddle.js'
import initReel from './init/reel.js'
import initGlitch from './init/glitch.js'
import initInstancing from './init/instancing.js'
import initParticle from './init/particle.js'
import initAttract from './init/attract.js'
import initHole from './init/hole.js'
import initMetalCube from './init/metalCube.js'
import initDistort from './init/distort.js'
import initImageData from './init/imageData.js'
import initGallery from './init/gallery.js'
import initComet from './init/comet.js'
import initHyperSpace from './init/hyperSpace.js'
import initFireBall from './init/fireBall.js'

import ConsoleSignature from './modules/common/ConsoleSignature.js';
import redirectOldSketches from './modules/common/redirectOldSketches.js';

const page = document.querySelector('.l-page');
const pageId = page.dataset.id;
const consoleSignature = new ConsoleSignature();

const init = () => {
  redirectOldSketches();
  initCommon();
  if (pageId !== 'index') initCommonSketch();
  switch (pageId) {
    case 'index': initIndex(); break;
    case 'puddle': initPuddle(); break;
    case 'reel': initReel(); break;
    case 'glitch': initGlitch(); break;
    case 'instancing': initInstancing(); break;
    case 'particle': initParticle(); break;
    case 'attract': initAttract(); break;
    case 'hole': initHole(); break;
    case 'metal_cube': initMetalCube(); break;
    case 'distort': initDistort(); break;
    case 'image_data': initImageData(); break;
    case 'gallery': initGallery(); break;
    case 'comet': initComet(); break;
    case 'hyper_space': initHyperSpace(); break;
    case 'fire_ball': initFireBall(); break;
    default:
  }
}
init();
