var Util = require('./util');

var exports = function(){
  var Mover = function() {
    this.rad1 = 0;
    this.rad2 = 0;
    this.range = 200;
    this.position = new THREE.Vector3();
  };
  
  Mover.prototype = {
    init: function(rad1, rad2) {
      this.rad1 = rad1;
      this.rad2 = rad2;
      this.updatePosition();
    },
    move: function() {
      this.rad1 += Util.getRadian(0.2);
      this.rad2 += Util.getRadian(0.6);
      this.updatePosition();
    },
    updatePosition: function() {
      var pos = Util.getSpherical(this.rad1, this.rad2, this.range);
      this.position.set(pos[0], pos[1], pos[2]);
    }
  };

  return Mover;
};

module.exports = exports();
