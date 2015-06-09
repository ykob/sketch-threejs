var exports = function(){
  var Globe = function() {
    this.r = 1500;
    this.segment = 20;
    this.textureSrc;
    
    this.geometry;
    this.material;
    this.mesh;
  };

  Globe.prototype.init = function(scene) {
    this.geometry = new THREE.SphereGeometry(this.r, this.segment, this.segment);
    this.geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    this.material = new THREE.MeshBasicMaterial({
      wireframe: true
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.mesh);
  };

  return Globe;
};

module.exports = exports();
