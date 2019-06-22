const THREE = require('three');

require('../vendor/GLTFLoader.js');

const gltfLoader = new THREE.GLTFLoader();

export default function(src) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(src, resolve, null, reject);
  });
}
