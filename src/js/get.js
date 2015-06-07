module.exports = (function(){
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
  
  return Get;
})();
