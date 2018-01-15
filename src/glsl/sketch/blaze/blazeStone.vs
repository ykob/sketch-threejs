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

#pragma glslify: calcRotateMat4 = require(glsl-matrix/calcRotateMat4);
#pragma glslify: calcScaleMat4 = require(glsl-matrix/calcScaleMat4);

void main(void) {
  mat4 scaleMat = calcScaleMat4(vec3(scale));
  mat4 rotateMatWorld = calcRotateMat4(vec3(0.0, rotate + time * speed * 0.2, 0.0));
  vec3 updatePosition = (scaleMat * vec4(position, 1.0)).xyz;
  vec4 mvPosition = modelViewMatrix * rotateMatWorld * vec4(updatePosition + instancePosition, 1.0);

  vPosition = updatePosition + instancePosition;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
