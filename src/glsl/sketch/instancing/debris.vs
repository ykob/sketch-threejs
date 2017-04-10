attribute vec3 position;
attribute vec3 translate;
attribute float offset;
attribute vec3 rotate;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

#pragma glslify: computeTranslateMat = require(glsl-matrix/computeTranslateMat);
#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);

void main(void) {
  float radian = radians(time);
  vec4 updatePosition =
    computeRotateMat(radian * 5.0 + rotate.x, radian * 20.0 + rotate.y, radian + rotate.z)
    * computeTranslateMat(translate)
    * computeRotateMat(radian * rotate.x * 100.0, radian * rotate.y * 100.0, radian * rotate.z * 100.0)
    * vec4(position + normalize(position) * offset, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
