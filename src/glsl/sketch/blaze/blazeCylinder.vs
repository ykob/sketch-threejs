attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main(void) {
  float roundRadius = (1.0 - smoothstep(0.1, 1.0, uv.y)* 1.2) * 480.0;
  vec3 roundPosition = vec3(
    sin(radians(uv.x * 360.0)) * roundRadius,
    position.y + 900.0,
    cos(radians(uv.x * 360.0)) * roundRadius
    );

  float noise = (snoise3(roundPosition * vec3(0.01, 0.0001, 0.01) + time * 0.8) + 0.5);
  float noiseRadius = noise * smoothstep(0.2, 0.3, uv.y) * 70.0;
  vec3 noisePosition = vec3(
    sin(radians(uv.x * 360.0)) * noiseRadius,
    0.0,
    cos(radians(uv.x * 360.0)) * noiseRadius
    );

  vec4 mvPosition = modelViewMatrix * vec4(roundPosition + noisePosition, 1.0);

  vPosition = roundPosition;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
