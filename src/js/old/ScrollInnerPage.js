module.exports = function() {
  var self = this;
  this.scrollTopBefore = 0;
  this.scrollTopAfter = 0;
  this.timeClick = 0;
  this.duration = 0;
  this.easingFunc = null;

  this.render = function() {
    var time = Date.now() - self.timeClick;
    window.scrollTo(0, self.scrollTopBefore + (self.scrollTopAfter - self.scrollTopBefore) * self.easingFunc(Math.min(time / self.duration, 1)));
    if (time < self.duration) {
      requestAnimationFrame(self.render);
    }
  }
  this.start = function(anchorY, duration, easingFunc) {
    if (self.isScrolling) return;
    self.duration = (duration) ? duration : 1000;
    self.easingFunc = (easingFunc) ? easingFunc : function(t) {
      return t;
    };
    self.timeClick = Date.now();
    self.scrollTopBefore = window.pageYOffset;
    self.scrollTopAfter = anchorY;
    self.render();
  }
}