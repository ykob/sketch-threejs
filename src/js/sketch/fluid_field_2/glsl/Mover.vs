attribute vec3 position;
attribute vec2 uvVelocity;
attribute vec3 color;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform vec2 resolution;
uniform float pixelRatio;
uniform sampler2D acceleration;
uniform sampler2D velocity;

varying vec3 vColor;
varying float vOpacity;

#pragma glslify: calcTranslateMat4 = require(glsl-matrix/calcTranslateMat4);

void main() {
  vec3 a = texture2D(acceleration, uvVelocity).xyz;
  vec3 v = texture2D(velocity, uvVelocity).xyz;
  vec4 mvPosition = modelViewMatrix * calcTranslateMat4(v) * vec4(position, 1.0);

  // Define the point size.
  float distanceFromCamera = length(mvPosition.xyz);

  vColor = a * 0.4 + 0.4 + color;
  vOpacity = length(a);

  gl_Position = projectionMatrix * mvPosition;
}
