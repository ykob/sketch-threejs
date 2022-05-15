attribute vec3 position;
attribute vec3 normal;
attribute float radian;
attribute vec3 hsv;
attribute float timeHover;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float rotate;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying mat4 vInvertMatrix;

#pragma glslify: inverse = require(glsl-inverse);
#pragma glslify: ease = require(glsl-easings/circular-out)
#pragma glslify: calcTranslateMat4 = require(@ykob/glsl-util/src/calcTranslateMat4);
#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);
#pragma glslify: calcScaleMat4 = require(@ykob/glsl-util/src/calcScaleMat4);
#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main(void) {
  float easeStep = ease(timeHover / 0.3);
  mat4 rotateMatWorld = calcRotateMat4(vec3(0.0, radian + radians(rotate), 0.0));
  mat4 scaleMat = calcScaleMat4(vec3(1.0 + easeStep * 0.2));
  mat4 translateMat = calcTranslateMat4(vec3(1000.0, 0.0, 0.0));
  vec4 updatePosition = rotateMatWorld * translateMat * scaleMat * vec4(position, 1.0);
  vPosition = updatePosition.xyz;
  vInvertMatrix = inverse(rotateMatWorld * translateMat);
  vColor = convertHsvToRgb(hsv * vec3(1.0, 1.0 - easeStep, 1.0));
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
