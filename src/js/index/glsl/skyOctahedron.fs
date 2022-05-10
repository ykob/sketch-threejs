#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform mat3 normalMatrix;
uniform float time;

varying vec3 vPosition;
varying float vNoise;
varying float vNow;

const vec3 lightDirection = vec3(1.0, -1.0, -1.0);
const float duration = 2.0;
const float delayAll = 1.0;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  float now = clamp((time - delayAll - 1.5) / duration, 0.0, 1.0);
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  vec3 light = normalize(normalMatrix * lightDirection);
  float diff = (dot(normal, light) + 1.0) / 2.0 * 0.2;
  float opacity = smoothstep(0.1, 0.2, vNow);
  vec3 v = normalize(vPosition);
  vec3 rgb = (1.0 - now) * vec3(1.0) + convertHsvToRgb(vec3(0.5 + (v.x + v.y + v.x) / 40.0 + time * 0.1, 0.8, 0.4 + sin(time) * 0.05 + vNoise * 0.02));
  gl_FragColor = vec4(rgb + diff, opacity);
}
