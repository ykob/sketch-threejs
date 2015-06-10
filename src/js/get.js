var exports = function(){
  var Get = function() {};
  
  Get.prototype.randomInt = function(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  };
  
  Get.prototype.degree = function(radian) {
    return radian / Math.PI * 180;
  };
  
  Get.prototype.radian = function(degrees) {
    return degrees * Math.PI / 180;
  };
  
  Get.prototype.pointSphere = function(rad1, rad2, r) {
    var x = Math.cos(rad1) * Math.cos(rad2) * r;
    var z = Math.cos(rad1) * Math.sin(rad2) * r;
    var y = Math.sin(rad1) * r;
    return [x, y, z];
  };
  
  return Get;
};

module.exports = exports();
