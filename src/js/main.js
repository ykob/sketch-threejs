import initCommon from './init/common.js'
import initCommonSketch from './init/commonSketch.js'
import initIndex from './init/index.js'

// initialize function for sketches
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

const init = () => {
  redirectOldSketches();
  const consoleSignature = new ConsoleSignature();
  const path = location.pathname.replace('/sketch-threejs', '');
  initCommon();
  if (path !== `/`) initCommonSketch();
  switch (path) {
    case '/': initIndex(); break;
    case '/sketch/glitch.html': initGlitch(); break;
    case '/sketch/instancing.html': initInstancing(); break;
    case '/sketch/particle.html': initParticle(); break;
    case '/sketch/attract.html': initAttract(); break;
    case '/sketch/hole.html': initHole(); break;
    case '/sketch/metal_cube.html': initMetalCube(); break;
    case '/sketch/distort.html': initDistort(); break;
    case '/sketch/image_data.html': initImageData(); break;
    case '/sketch/gallery.html': initGallery(); break;
    case '/sketch/comet.html': initComet(); break;
    case '/sketch/hyper_space.html': initHyperSpace(); break;
    case '/sketch/fire_ball.html': initFireBall(); break;
    default:
  }
}
init();
