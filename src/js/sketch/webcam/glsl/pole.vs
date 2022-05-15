attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPosition;
attribute float iDelay;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform float force;

varying vec3 vPosition;
varying vec3 vColor;
varying float vOpacity;

#pragma glslify: calcTranslateMat4 = require(@ykob/glsl-util/src/calcTranslateMat4);
#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

const float duration = 8.0;

void main(void) {
  // Loop animation
  float interval = mod(time + iDelay, duration) / duration;
  vec3 move = vec3(0.0, 0.0, (interval * 2.0 - 1.0) * 100.0);

  // calculate gradation with position.y
  vec3 hsv = vec3(0.3 + time * 0.1, 0.3 - force * 0.01, 0.85 + force * 0.01);
  vec3 rgb = convertHsvToRgb(hsv);

  // coordinate transformation
  mat4 translateMat = calcTranslateMat4(iPosition);
  vec4 mPosition = modelMatrix * translateMat * vec4(position + move, 1.0);
  vec4 mvPosition = viewMatrix * mPosition;

  vPosition = mPosition.xyz;
  vColor = rgb;
  vOpacity = smoothstep(-100.0, 0.0, move.z);

  gl_Position = projectionMatrix * mvPosition;
}
