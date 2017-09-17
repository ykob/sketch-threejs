attribute vec3 position;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 textureMatrix;

varying vec3 vPosition;
varying vec4 vUv;

void main(void) {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);

  vPosition = worldPosition.xyz;
  vUv = textureMatrix * worldPosition;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
