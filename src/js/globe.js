var exports = function(){
  var Globe = function() {
    this.r = 200;
    this.segment = 30;
    this.textureSrc;
    
    this.geometry;
    this.material;
    this.mesh;
  };

  Globe.prototype.init = function(scene) {
    this.textureSrc = new THREE.ImageUtils.loadTexture('img/earthmap1k.jpg');
    this.geometry = new THREE.SphereGeometry(this.r, this.segment, this.segment);
    this.material = new THREE.MeshLambertMaterial({
      map: this.textureSrc
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    scene.add(this.mesh);
  };

  return Globe;
};

module.exports = exports();
