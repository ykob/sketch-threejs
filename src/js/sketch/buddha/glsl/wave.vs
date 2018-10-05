attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;

void main(void) {
  vec2 p = uv * 2.0 - 1.0;

  // wave motion.
  vec3 wave = vec3(0.0, 0.0, sin(-time + length(p.xy) * 12.0) * 1.0);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position + wave, 1.0);

  vPosition = position + wave;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
