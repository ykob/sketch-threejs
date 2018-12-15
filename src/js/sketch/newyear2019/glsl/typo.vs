attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vTime1;
varying float vTime2;

#pragma glslify: ease = require(glsl-easings/circular-out)

void main(void) {
  // Defined several timers.
  float time1 = ease(clamp(time - 1.0, 0.0, 2.0) / 2.0);
  float time2 = ease(clamp(time - 3.0, 0.0, 2.0) / 2.0);

  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position + vec3(0.0, 0.0, (1.0 - time1) * 20.0), 1.0);

  vPosition = position;
  vUv = uv;
  vTime1 = time1;
  vTime2 = time2;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
