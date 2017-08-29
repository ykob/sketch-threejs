import ConsoleSignature from './modules/common/ConsoleSignature.js';
import redirectOldSketches from './modules/common/redirectOldSketches.js';

const init = {
  common: require('./init/common.js').default,
  index: require('./init/index.js').default,
  sketch: {
    common: require('./init/commonSketch.js').default,
    puddle: require('./init/puddle.js').default,
    reel: require('./init/reel.js').default,
    glitch: require('./init/glitch.js').default,
    instancing: require('./init/instancing.js').default,
    particle: require('./init/particle.js').default,
    attract: require('./init/attract.js').default,
    hole: require('./init/hole.js').default,
    metalCube: require('./init/metalCube.js').default,
    distort: require('./init/distort.js').default,
    imageData: require('./init/imageData.js').default,
    gallery: require('./init/gallery.js').default,
    comet: require('./init/comet.js').default,
    hyperSpace: require('./init/hyperSpace.js').default,
    fireBall: require('./init/fireBall.js').default,
  }
};
const page = document.querySelector('.l-page');
const pageId = page.dataset.id;
const consoleSignature = new ConsoleSignature();

redirectOldSketches();
init.common();
if (pageId !== 'index') init.sketch.common();
switch (pageId) {
  case 'index': init.index(); break;
  case 'puddle': init.sketch.puddle(); break;
  case 'reel': init.sketch.reel(); break;
  case 'glitch': init.sketch.glitch(); break;
  case 'instancing': init.sketch.instancing(); break;
  case 'particle': init.sketch.particle(); break;
  case 'attract': init.sketch.attract(); break;
  case 'hole': init.sketch.hole(); break;
  case 'metal_cube': init.sketch.metalCube(); break;
  case 'distort': init.sketch.distort(); break;
  case 'image_data': init.sketch.imageData(); break;
  case 'gallery': init.sketch.gallery(); break;
  case 'comet': init.sketch.comet(); break;
  case 'hyper_space': init.sketch.hyperSpace(); break;
  case 'fire_ball': init.sketch.fireBall(); break;
  default:
}
