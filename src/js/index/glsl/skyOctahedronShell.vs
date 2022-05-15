attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

varying vec3 vPosition;
varying float vOpacity;

const float duration = 4.0;
const float delay = 3.0;

#pragma glslify: ease = require(glsl-easings/exponential-out)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: calcTranslateMat4 = require(@ykob/glsl-util/src/calcTranslateMat4);
#pragma glslify: calcScaleMat4 = require(@ykob/glsl-util/src/calcScaleMat4);
#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);

void main() {
  float now = clamp((time - delay) / duration, 0.0, 1.0);
  mat4 translateMat = calcTranslateMat4(vec3(0.0, sin(time) * 10.0 + 210.0, 0.0));
  mat4 scaleMat = calcScaleMat4(vec3(ease(now) * 0.6 + 0.4 + sin(time * 2.0) * 0.04));
  mat4 rotateMat = calcRotateMat4(vec3(radians(45.0), radians(time * 2.0), radians(-time * 2.0)));
  float noise = smoothstep(-0.4, 0.4, cnoise3(position * 0.035 - time)) * 2.0 - 1.0;
  vec4 updatePosition = translateMat * rotateMat * scaleMat * vec4(position + normalize(position) * noise * 2.0, 1.0);
  vPosition = normalize(position);
  vOpacity = normalize(updatePosition).z;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
