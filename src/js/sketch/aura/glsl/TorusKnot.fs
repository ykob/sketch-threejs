#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float alpha;
uniform float renderOutline;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb)

void main() {
  // Flat Shading
  vec3 light = normalize(vec3(-1.0, 1.0, -1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = dot(normal, light) * 0.5;

  vec3 hsv = vec3(0.5 + alpha + diff * 0.8, 0.4, 0.8);
  vec3 rgb = convertHsvToRgb(hsv);

  vec3 color = (rgb + diff) * (1.0 - renderOutline);
  vec3 colorOutline = vec3(1.0) * renderOutline;

  gl_FragColor = vec4(color + colorOutline, 1.0);
}
