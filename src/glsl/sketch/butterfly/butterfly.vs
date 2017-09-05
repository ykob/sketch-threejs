attribute vec3 position;
attribute vec2 uv;
attribute vec2 uvVelocity;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform sampler2D acceleration;
uniform sampler2D velocity;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: computeTranslateMat = require(glsl-matrix/computeTranslateMat);

void main() {
  vec3 v = texture2D(velocity, vec2(0.0)).xyz;
  float flapTime = radians(sin(time * 6.0 - abs(position.x) / 100.0 * 1.6) * 36.0);
  float hovering = cos(time * 2.0) * 12.0;
  vec3 updatePosition = vec3(
    cos(flapTime) * position.x,
    position.y + hovering,
    sin(flapTime) * abs(position.x) + hovering
  );

  mat4 translateMatrix = computeTranslateMat(v);
  vec4 mvPosition = modelViewMatrix * translateMatrix * vec4(updatePosition, 1.0);

  vPosition = position;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
