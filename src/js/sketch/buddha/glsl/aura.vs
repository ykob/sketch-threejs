attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

#pragma glslify: ease = require(glsl-easings/quadratic-out)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

void main(void) {
  vec2 p = uv * 2.0 - 1.0;

  float circle = ease(clamp(1.0 - length(p), 0.0, 1.0));
  float noise = cnoise3(position * 0.05 + vec3(0.0, 0.0, time) * 0.1);
  vec3 noisePosition = normalize(position) * noise * 0.0;

  float noiseA = cnoise3(vec3(p.x + cos(time), length(p) * 20.0, p.y + sin(time)));

  // coordinate transformation
  vec3 updatePosition = noisePosition + position;
  vec4 mPosition = modelMatrix * vec4(updatePosition, 1.0);
  vec4 mvPosition = viewMatrix * mPosition;

  vPosition = updatePosition;
  vUv = uv;
  vOpacity = circle * noiseA * 2.0;

  gl_Position = projectionMatrix * mvPosition;
}
