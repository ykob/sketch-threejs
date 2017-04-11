attribute vec3 position;
attribute vec3 normal;
attribute vec3 translate;
attribute float offset;
attribute vec3 rotate;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec3 vPosition;
varying vec3 vNormal;

#pragma glslify: computeTranslateMat = require(glsl-matrix/computeTranslateMat);
#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);

void main(void) {
  float radian = radians(time);
  mat4 rotateWorld = computeRotateMat(radian * 5.0 + rotate.x, radian * 20.0 + rotate.y, radian + rotate.z);
  mat4 rotateSelf = computeRotateMat(radian * rotate.x * 100.0, radian * rotate.y * 100.0, radian * rotate.z * 100.0);
  vec4 updatePosition =
    rotateWorld
    * computeTranslateMat(translate)
    * rotateSelf
    * vec4(position + normalize(position) * offset, 1.0);
  vPosition = (modelMatrix * updatePosition).xyz;
  vNormal = (modelMatrix * rotateWorld * rotateSelf * vec4(normal, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
