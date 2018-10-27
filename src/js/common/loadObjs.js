const THREE = require('three');

require('../vendor/OBJLoader.js');

const objLoader = new THREE.OBJLoader();

export default function(objs, callback) {
  const length = Object.keys(objs).length;
  const loadedObjs = {};
  let count = 0;

  for (var key in objs) {
    const k = key;
    if (objs.hasOwnProperty(k)) {
      objLoader.load(objs[k], (object) => {
        loadedObjs[k] = object;
        count++;
        if (count >= length) callback(loadedObjs);
      });
    }
  }
}
