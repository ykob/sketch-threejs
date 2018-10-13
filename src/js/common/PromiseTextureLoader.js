const THREE = require('three/build/three.js');

const texLoader = new THREE.TextureLoader();

export default function(src) {
  return new Promise((resolve, reject) => {
    texLoader.load(src, resolve, null, reject);
  });
}
