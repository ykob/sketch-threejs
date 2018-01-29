attribute vec3 position;
attribute vec3 position2;
attribute vec2 uv;
attribute float opacity;
attribute float opacity2;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

void main(void) {
  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vPosition = position;
  vUv = uv;
  vOpacity = opacity;

  gl_Position = projectionMatrix * mvPosition;
}
