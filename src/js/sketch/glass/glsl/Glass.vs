attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;

void main(void) {
  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position, 1.0);

  vPosition = mPosition.xyz;
  vUv = uv;
  vNormal = (viewMatrix * modelMatrix * vec4(normal, 1.0)).xyz;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
