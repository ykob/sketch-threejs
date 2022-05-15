attribute vec3 position;
attribute vec3 instancePosition;
attribute vec3 instanceRotate;
attribute vec3 instanceScale;
attribute float speed;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;

#pragma glslify: calcTranslateMat4 = require(@ykob/glsl-util/src/calcTranslateMat4);
#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);
#pragma glslify: calcScaleMat4 = require(@ykob/glsl-util/src/calcScaleMat4);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: ease = require(glsl-easings/exponential-out);

void main(void) {
  // added Noise to form like a cloud.
  float noise = snoise3(position + instancePosition);
  vec3 noiseEasePos = normalize(vec3(position.x, position.y, 0.01)) * ease(1.0 - abs(position.z / 10.0)) * vec3(0.4, 1.0, 1.0);
  vec3 noisePosition = (noise + 1.0) / 2.0 * noiseEasePos * 3.0 + noiseEasePos * 1.0;

  // coordinate transformation
  mat4 translateMat = calcTranslateMat4(instancePosition);
  mat4 rotateMat = calcRotateMat4(instanceRotate);
  mat4 scaleMat = calcScaleMat4(instanceScale);
  mat4 worldRotateMat = calcRotateMat4(vec3(0.0, -time * speed, 0.0));
  vec4 mvPosition = modelViewMatrix * worldRotateMat * translateMat * rotateMat * scaleMat * vec4(position + noisePosition, 1.0);

  vPosition = mvPosition.xyz;

  gl_Position = projectionMatrix * mvPosition;
}
