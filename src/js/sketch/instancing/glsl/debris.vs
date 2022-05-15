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

#pragma glslify: calcTranslateMat4 = require(@ykob/glsl-util/src/calcTranslateMat4);
#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);

void main(void) {
  float radian = radians(time);
  mat4 rotateWorld = calcRotateMat4(vec3(radian) * vec3(5.0, 20.0, 1.0) + rotate);
  mat4 rotateSelf = calcRotateMat4(vec3(radian) * rotate * 100.0);
  vec4 updatePosition =
    rotateWorld
    * calcTranslateMat4(translate)
    * rotateSelf
    * vec4(position + normalize(position) * offset, 1.0);
  vPosition = (modelMatrix * updatePosition).xyz;
  vNormal = (modelMatrix * rotateWorld * rotateSelf * vec4(normal, 0.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
