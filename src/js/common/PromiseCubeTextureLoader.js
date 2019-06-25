const THREE = require('three');

const cubeTexLoader = new THREE.CubeTextureLoader();

export default function(path, srcs) {
  return new Promise((resolve, reject) => {
    cubeTexLoader.setPath(path).load(srcs, resolve, null, reject);
  });
}
