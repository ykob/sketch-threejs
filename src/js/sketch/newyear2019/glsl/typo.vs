attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform float time2;

varying vec3 vPosition;
varying vec2 vUv;
varying float vTime1;
varying float vTime2;
varying float vTime3;
varying float vTime4;

#pragma glslify: ease = require(glsl-easings/circular-out)

void main(void) {
  // Defined several timers.
  float timeA = ease(clamp(time - 1.0, 0.0, 2.0) / 2.0);
  float timeB = ease(clamp(time - 3.0, 0.0, 2.0) / 2.0);

  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position + vec3(0.0, 0.0, (1.0 - timeA) * 20.0), 1.0);

  vPosition = position;
  vUv = uv;
  vTime1 = timeA;
  vTime2 = timeB;
  vTime3 = ease(smoothstep(0.0, 0.8, time2));
  vTime4 = ease(smoothstep(5.0, 7.0, time2));

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
