uniform float time;

varying vec3 vPosition;
varying mat4 vInvertMatrix;

#pragma glslify: inverse = require(glsl-inverse);

void main() {
  vPosition = position;
  vInvertMatrix = inverse(modelMatrix);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
