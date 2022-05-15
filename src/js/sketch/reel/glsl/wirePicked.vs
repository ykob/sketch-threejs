attribute vec3 position;
attribute float radian;
attribute vec3 pickedColor;
attribute float timeHover;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float rotate;

varying vec3 vColor;

#pragma glslify: ease = require(glsl-easings/circular-out)
#pragma glslify: calcTranslateMat4 = require(@ykob/glsl-util/src/calcTranslateMat4);
#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);
#pragma glslify: calcScaleMat4 = require(@ykob/glsl-util/src/calcScaleMat4);

void main(void) {
  float easeStep = ease(timeHover / 0.3);
  mat4 rotateMatWorld = calcRotateMat4(vec3(0.0, radian + radians(rotate), 0.0));
  mat4 scaleMat = calcScaleMat4(vec3(1.0 + easeStep * 0.2));
  mat4 translateMat = calcTranslateMat4(vec3(1000.0, 0.0, 0.0));
  vec4 updatePosition = rotateMatWorld * translateMat * scaleMat * vec4(position, 1.0);
  vColor = pickedColor;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
