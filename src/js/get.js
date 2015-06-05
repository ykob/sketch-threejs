var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getDegree = function(radian) {
  return radian / Math.PI * 180;
};

var getRadian = function(degrees) {
  return degrees * Math.PI / 180;
};

module.exports = {
  randomInt: getRandomInt(),
  degree: getDegree(),
  radian: getRadian()
};
