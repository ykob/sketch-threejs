attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;

varying vec2 vUv;

void main() {
  vec3 transformedNormal = normal;
  transformedNormal = normalMatrix * transformedNormal;

  vec3 transformed = position;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(transformed, 1.0);

  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
