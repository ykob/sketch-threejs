attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main(void) {
  vec3 roundPosition = vec3(
    sin(radians(uv.x * 360.0)) * 750.0,
    position.y + 300.0,
    cos(radians(uv.x * 360.0)) * 750.0
    );

  float noise = (snoise3(roundPosition * 0.0015 + time * 1.2) + 0.5);
  vec3 noisePosition = vec3(
    sin(radians(uv.x * 360.0)) * noise * 300.0 * uv.y,
    0.0,
    cos(radians(uv.x * 360.0)) * noise * 300.0 * uv.y
    );

  vec4 mvPosition = modelViewMatrix * vec4(roundPosition + noisePosition, 1.0);

  vPosition = roundPosition;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
