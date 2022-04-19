module.exports = function() {
  var ua = navigator.userAgent;
  return (ua.indexOf("Android") >= 0);
}