attribute vec3 position;
attribute vec3 normal;
attribute float radian;
attribute vec3 hsv;
attribute float noiseDiff;
attribute float speed;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float rotate;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vColor;

#pragma glslify: calcTranslateMat4 = require(@ykob/glsl-util/src/calcTranslateMat4);
#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);
#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

void main(void) {
  float noise = snoise3(position * 0.02 + time * speed + noiseDiff);
  mat4 rotateMatWorld = calcRotateMat4(vec3(0.0, radian + radians(rotate), 0.0));
  mat4 translateMat = calcTranslateMat4(vec3(1000.0, 0.0, 0.0));
  vec4 updatePosition = rotateMatWorld * translateMat * vec4(
    position + normalize(position) * noise * 5.0,
    1.0
    );
  vPosition = updatePosition.xyz;
  vNormal = normal;
  vColor = convertHsvToRgb(hsv);
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
