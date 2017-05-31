attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec3 vPosition;

void main(void) {
  vec4 updatePosition = vec4(position, 1.0);
  vPosition = (modelMatrix * updatePosition).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
