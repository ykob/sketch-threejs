attribute vec3 position;
attribute float delay;
attribute float speed;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vColor1;
varying vec3 vColor2;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);
#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);

const float duration = 3.0;

void main() {
  // calculate interval time from 0 to 1
  float interval = mod(time + delay * duration, duration) / duration;

  // update position and size
  float size = 10.0 * sin(interval * 4.0);
  float blink = max(sin(interval * 4.0) * 2.0 - 1.0, 0.0);
  mat4 rotateMat = calcRotateMat4(vec3(
    radians(time * speed * 0.3),
    radians(time * speed),
    radians(time * speed * 0.3)
    ));

  // calculate colors
  vec3 hsv1 = vec3(time * 0.1, 0.6, 1.0);
  vec3 rgb1 = convertHsvToRgb(hsv1);
  vec3 hsv2 = vec3(time * 0.1 + 0.2, 0.6, 1.0);
  vec3 rgb2 = convertHsvToRgb(hsv2);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * rotateMat * vec4(position, 1.0);
  float distanceFromCamera = 1000.0 / length(mvPosition.xyz);

  vColor1 = rgb1;
  vColor2 = rgb2;
  vOpacity = blink * clamp(distanceFromCamera, 0.1, 0.8);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = distanceFromCamera * size;
}
