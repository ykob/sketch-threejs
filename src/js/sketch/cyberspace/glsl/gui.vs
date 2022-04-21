attribute vec3 position;
attribute vec2 uv;

attribute vec3 instancePosition;
attribute float rotate1;
attribute float rotate2;
attribute float rotate3;
attribute float h;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;
varying float vRotate1;
varying float vRotate2;
varying float vRotate3;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb)

void main(void) {
  // calculate colors
  vec3 hsv = vec3(h + time * 0.1 + 0.5, 0.4, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position + instancePosition, 1.0);

  vPosition = position;
  vUv = uv;
  vColor = rgb;
  vRotate1 = rotate1;
  vRotate2 = rotate2;
  vRotate3 = rotate3;

  gl_Position = projectionMatrix * mvPosition;
}
