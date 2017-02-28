attribute vec3 position;
attribute vec2 uv;
attribute vec2 uvVelocity;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform sampler2D acceleration;
uniform sampler2D velocity;

varying vec2 vUv;

#pragma glslify: computeTranslateMat = require(glsl-matrix/computeTranslateMat);

void main() {
  vec3 v = texture2D(velocity, vec2(0.0)).xyz;
  float flapTime = radians(sin(time * 20.0) * 45.0);
  vec3 updatePosition = vec3(
    cos(flapTime) * position.x,
    position.y,
    sin(flapTime) * abs(position.x)
  );
  mat4 translateMatrix = computeTranslateMat(v);
  vec4 mvPosition = modelViewMatrix * translateMatrix * vec4(updatePosition, 1.0);
  vUv = uv;
  gl_Position = projectionMatrix * mvPosition;
}
