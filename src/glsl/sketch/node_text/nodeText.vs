attribute vec3 position;
attribute vec3 position2;
attribute vec2 uv;
attribute float opacity;
attribute float opacity2;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

#pragma glslify: calcRotateMat4 = require(glsl-matrix/calcRotateMat4);

void main(void) {
  // calculate shake moving.
  float now = time * 10.0 + length(position);
  mat4 rotateMat = calcRotateMat4(vec3(now));
  vec3 shake = (rotateMat * vec4(vec3(0.0, sin(now) * 5.0, 0.0), 1.0)).xyz;

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position + shake, 1.0);

  vPosition = position;
  vUv = uv;
  vOpacity = opacity;

  gl_Position = projectionMatrix * mvPosition;
}
