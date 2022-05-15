attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPosition;
attribute vec3 iColor;
attribute vec3 iRotate;
attribute float iDelay;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying vec4 vColor;

#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);
#pragma glslify: ease = require(glsl-easings/exponential-out)

const float DURATION = 5.5;

void main(void) {
  float alpha = clamp(time, 0.0, DURATION) / DURATION;

  // coordinate transformation
  mat4 rotateMat1 = calcRotateMat4(iRotate);
  mat4 rotateMat2 = calcRotateMat4(vec3(0.0, (time + iDelay) * 14.0, 0.0));
  vec3 rotate = (rotateMat1 * rotateMat2 * vec4(position, 1.0)).xyz;
  vec3 move = vec3(0.0, 0.0, ease(alpha) * 40.0 + time * 4.0);
  vec4 mPosition = modelMatrix * vec4(iPosition + rotate + move, 1.0);

  float opacity = smoothstep(0.0, 0.05, alpha) * (1.0 - smoothstep(0.9, 1.0, alpha));

  vPosition = position;
  vUv = uv;
  vColor = vec4(iColor, opacity);

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
