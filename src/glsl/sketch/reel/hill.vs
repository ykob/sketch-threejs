attribute vec3 position;
attribute vec3 normal;
attribute float height;
attribute float offsetX;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

varying vec3 vPosition;
varying vec3 vColor;
varying mat4 vInvertMatrix;

#pragma glslify: inverse = require(glsl-inverse);

void main(void) {
  vec3 updatePosition = vec3(position.x + offsetX, (position.y + 0.5) * height, position.z);
  vPosition = updatePosition;
  vInvertMatrix = inverse(modelMatrix);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(updatePosition, 1.0);
}
