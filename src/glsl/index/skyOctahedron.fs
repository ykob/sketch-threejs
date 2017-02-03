precision highp float;

uniform mat3 normalMatrix;
uniform float time;

varying vec3 vPosition;
varying float vNoise;
varying float vNow;

const vec3 lightDirection = vec3(1.0, -1.0, -1.0);
const float duration = 1.0;
const float delay = 2.0;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  vec3 light = normalize(normalMatrix * lightDirection);
  float diff = (dot(normal, light) + 1.0) / 2.0 * 0.3;
  float opacity = smoothstep(0.1, 0.2, vNow);
  vec3 v = normalize(vPosition);
  vec3 rgb = convertHsvToRgb(vec3(0.5 + (v.x + v.y + v.x) / 40.0 + time * 0.1, 0.12, 0.9 + vNoise * 0.1));
  gl_FragColor = vec4(rgb + diff, opacity);
}
