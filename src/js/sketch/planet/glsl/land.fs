#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float addH1;
uniform float addH2;

varying vec3 vMPosition;
varying float vHeight;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

const float edge1 = 56.0;
const float edge2 = 52.0;
const float edge3 = 50.0;
const float range = 2.0;

void main() {
  // Flat Shading
  vec3 light = normalize(vec3(-1.0, 1.0, 1.0));
  vec3 normal = normalize(cross(dFdx(vMPosition), dFdy(vMPosition)));
  float diff = (dot(normal, light) + 1.0) / 2.0;

  float stepTop     = smoothstep(edge1, edge1 + range, vHeight);
  float stepMiddle1 = smoothstep(edge2, edge2 + range, vHeight) * (1.0 - smoothstep(edge1, edge1 + range, vHeight));
  float stepMiddle2 = smoothstep(edge3, edge3 + range, vHeight) * (1.0 - smoothstep(edge2, edge2 + range, vHeight));
  float stepBottom  = 1.0 - smoothstep(edge3, edge3 + range, vHeight);

  vec4 colorTop     = vec4(convertHsvToRgb(vec3(0.25 + addH1, 0.05, 1.0)), 1.0) * stepTop;
  vec4 colorMiddle1 = vec4(convertHsvToRgb(vec3(0.25 + addH2, 0.05, 1.0)), 1.0) * stepMiddle1;
  vec4 colorMiddle2 = vec4(convertHsvToRgb(vec3(0.25 + addH2, 0.1, 0.9)), 1.0) * stepMiddle2;
  vec4 colorBottom  = vec4(convertHsvToRgb(vec3(0.25 + addH1, 0.1, 0.9)), 1.0) * stepBottom;

  vec4 colorAll = (colorTop + colorMiddle1 + colorMiddle2 + colorBottom) * diff;

  gl_FragColor = colorAll;
}
