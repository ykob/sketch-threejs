attribute vec3 position;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;
uniform mat4 textureMatrix;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vUv;
varying mat4 vInvertMatrix;

#pragma glslify: inverse = require(glsl-inverse);

void main(void) {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vPosition = worldPosition.xyz;
  vNormal = normal;
  vUv = textureMatrix * worldPosition;
  vInvertMatrix = inverse(modelMatrix);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
