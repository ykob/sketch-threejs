attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;
uniform float time;

varying vec3 vPosition;
varying vec3 vMPosition;
varying vec2 vUv;

#pragma glslify: ease = require(glsl-easings/exponential-out)
#pragma glslify: calcScaleMat4 = require(@ykob/glsl-util/src/calcScaleMat4);

void main(void) {
  float show = ease(min(time - 1.0, 4.0) / 4.0);

  // coordinate transformation
  mat4 scaleMat = calcScaleMat4(vec3(0.5 + show * 0.5));
  vec4 mPosition = modelMatrix * scaleMat * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix *mPosition;

  vPosition = position;
  vMPosition = mPosition.xyz;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
