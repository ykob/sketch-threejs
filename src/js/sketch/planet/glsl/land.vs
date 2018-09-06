attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec3 vMPosition;
varying float vHeight;

void main(void) {
  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position, 1.0);

  vHeight = length(position);
  vMPosition = mPosition.xyz;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
