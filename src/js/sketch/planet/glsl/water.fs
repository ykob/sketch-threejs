#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float addH;

varying vec3 vPosition;
varying float vSinAll;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  // Flat Shading
  vec3 light = normalize(vec3(-1.0, 1.0, 1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = (dot(normal, light) + 1.0) / 2.0;

  vec4 color = vec4(convertHsvToRgb(vec3(0.2 + vSinAll * 0.08 + addH, 0.4, 1.0)), 0.8);

  gl_FragColor = color * vec4(vec3(diff), 1.0);
}
