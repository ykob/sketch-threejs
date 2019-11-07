attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform float renderOutline;

varying vec3 vPosition;
varying vec2 vUv;

void main(void) {
  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position + normal * renderOutline * 0.3, 1.0);

  vPosition = mPosition.xyz;
  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
