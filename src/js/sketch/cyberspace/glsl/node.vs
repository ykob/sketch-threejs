attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float timeShow;
uniform float durationShow;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);
#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);

varying vec3 vPosition;
varying vec3 vColor;
varying float vOpacity;

void main() {
  // convert uv to range from -1.0 to 1.0
  vec2 resolution = uv * 2.0 - 1.0;

  // update rotation
  float rotateX = resolution.x * 100.0 + time / 2.0;
  float rotateY = resolution.y * 200.0 + time / 2.0;
  float rotateZ = length(resolution.xy) * 150.0 + time / 2.0;
  mat4 rotateMat = calcRotateMat4(vec3(rotateX, rotateY, rotateZ));
  vec3 rotatePosition = (rotateMat * vec4(vec3(sin(time * 0.1 + resolution.x * 10.0) * 150.0), 1.0)).xyz;

  // update position
  vec3 wavePosition = vec3(0.0, 0.0, sin(time * 0.1 + (resolution.x + resolution.y) * 5.6) * 300.0);
  vec3 updatePosition = position + rotatePosition + wavePosition;

  // calculate colors
  vec3 hsv = vec3(time * 0.1 + 0.5, 0.35, 0.6);
  vec3 rgb = convertHsvToRgb(hsv);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(updatePosition, 1.0);

  vPosition = updatePosition;
  vColor = rgb;

  gl_Position = projectionMatrix * mvPosition;
}
