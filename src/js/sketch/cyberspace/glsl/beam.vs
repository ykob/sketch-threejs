attribute vec3 position;
attribute vec2 uv;
attribute vec3 instancePosition;
attribute float delay;
attribute float h;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vDelay;
varying vec3 vColor;

#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);
#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb)

void main(void) {
  // update positions
  vec3 updatePosition = position + instancePosition;
  mat4 rotateMat = calcRotateMat4(vec3(radians(90.0), 0.0, radians(180.0)));

  // calculate colors
  vec3 hsv = vec3(h + time * 0.1, 0.35, 0.6);
  vec3 rgb = convertHsvToRgb(hsv);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * rotateMat * vec4(updatePosition, 1.0);

  vPosition = position;
  vUv = uv;
  vDelay = delay;
  vColor = rgb;

  gl_Position = projectionMatrix * mvPosition;
}
