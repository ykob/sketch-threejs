var bodyWidth  = document.body.clientWidth;
var bodyHeight = document.body.clientHeight;
var fps = 60;
var frameTime = 1000 / fps;

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var getDegree = function(radian) {
  return radian / Math.PI * 180;
};

var getRadian = function(degrees) {
  return degrees * Math.PI / 180;
};

var debounce = function(object, eventType, callback){
  var timer;

  object.addEventListener(eventType, function(event) {
    clearTimeout(timer);
    timer = setTimeout(function(){
      callback(event);
    }, 500);
  }, false);
};

var canvasResize = function() {
  bodyWidth  = document.body.clientWidth;
  bodyHeight = document.body.clientHeight;
};

debounce(window, 'resize', function(event){
  canvasResize();
});

canvasResize();
