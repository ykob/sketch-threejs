var exports = function(){
  var Globe = function() {
    this.r = 1200;
    this.segment = 30;
    this.textureSrc;
    
    this.geometry;
    this.material;
    this.mesh;
  };

  Globe.prototype.init = function(scene) {
    this.textureSrc = new THREE.ImageUtils.loadTexture('img/360.jpg');
    this.geometry = new THREE.SphereGeometry(this.r, this.segment, this.segment);
    this.geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    this.material = new THREE.MeshBasicMaterial({
      map: this.textureSrc
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.mesh);
  };

  return Globe;
};

module.exports = exports();
