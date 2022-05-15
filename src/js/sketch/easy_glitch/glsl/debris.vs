attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPosition;
attribute float iIds;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec3 vPosition;

#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);
#pragma glslify: calcRotateMat4Y = require(@ykob/glsl-util/src/calcRotateMat4Y);

void main(void) {
  // coordinate transformation
  mat4 rotateMat = calcRotateMat4(vec3(radians(iIds * 20.0 + time * 4.0)));
  vec3 rotatePosition = (rotateMat * vec4(position, 1.0)).xyz;
  mat4 rotateMatWorld = calcRotateMat4Y(radians(iIds * 56.0 + time * 0.5));
  vec4 mPosition = modelMatrix * rotateMatWorld * vec4(iPosition + rotatePosition, 1.0);

  vPosition = mPosition.xyz;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
