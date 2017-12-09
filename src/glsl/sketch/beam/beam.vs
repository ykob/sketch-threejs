attribute vec3 position;
attribute vec2 uv;
attribute vec3 instancePosition;
attribute float rotate;
attribute float delay;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying float vOpacity;

#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);

const float duration = 2.4;

void main(void) {
  vec3 wavePosition = vec3(0.0, 0.0, sin(radians(position.y / 3.0) + time * 0.1 + delay) * 20.0);
  vec3 updatePosition = position + instancePosition + wavePosition;
  mat4 rotateMat = computeRotateMat(radians(90.0), 0.0, radians(rotate));
  vec4 mvPosition = modelViewMatrix * rotateMat * vec4(updatePosition, 1.0);

  float now = mod(time + delay, duration) / duration;
  float opacity = smoothstep(0.94, 1.0, mod(uv.y - now, 1.0));

  vOpacity = opacity;

  gl_Position = projectionMatrix * mvPosition;
}
