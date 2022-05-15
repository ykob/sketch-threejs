attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float rotate;

#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);

void main(void) {
  mat4 rotateMat = calcRotateMat4(vec3(time * 0.1 + rotate));
  vec4 updatePosition = rotateMat * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
