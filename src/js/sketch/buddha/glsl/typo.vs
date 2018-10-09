attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPosition;
attribute vec2 iUv;
attribute float iTime;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float unitUv;
uniform float duration;

varying vec2 vUv;

void main(void) {
  vec3 move = vec3(0.0, iTime / duration * 20.0, 0.0);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(iPosition + position + move, 1.0);

  vUv = uv * unitUv + iUv;

  gl_Position = projectionMatrix * mvPosition;
}
