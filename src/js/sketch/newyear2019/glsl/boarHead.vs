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

void main(void) {
  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix *mPosition;

  vPosition = position;
  vMPosition = mPosition.xyz;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
