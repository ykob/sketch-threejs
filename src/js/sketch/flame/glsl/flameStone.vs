attribute vec3 position;
attribute vec2 uv;
attribute vec3 instancePosition;
attribute float scale;
attribute float rotate;
attribute float speed;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vDistance;

#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);
#pragma glslify: calcScaleMat4 = require(@ykob/glsl-util/src/calcScaleMat4);

void main(void) {
  mat4 scaleMat = calcScaleMat4(vec3(scale));
  mat4 rotateMatWorld = calcRotateMat4(vec3(0.0, rotate + time * speed * 0.2, 0.0));
  vec3 updatePosition = (scaleMat * vec4(position, 1.0)).xyz;
  vec4 mvPosition = modelViewMatrix * rotateMatWorld * vec4(updatePosition + instancePosition, 1.0);
  float distanceFromCenter = 1.0 - clamp(length(instancePosition) / 6000.0, 0.0, 0.8);

  vPosition = updatePosition + instancePosition;
  vUv = uv;
  vDistance = distanceFromCenter;

  gl_Position = projectionMatrix * mvPosition;
}
