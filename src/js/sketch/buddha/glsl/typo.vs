attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPosition;
attribute vec2 iUv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float unitUv;

varying vec2 vUv;

void main(void) {
  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(iPosition + position, 1.0);

  vUv = uv * unitUv + iUv;

  gl_Position = projectionMatrix * mvPosition;
}
