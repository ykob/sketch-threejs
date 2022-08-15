require("@babel/polyfill");

import initDistort from './sketch/distort/init'

const init = () => {
  initDistort('canvas-webgl');
}
init();

