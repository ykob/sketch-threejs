precision highp float;

uniform float renderOutline;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  // Flat Shading
  vec3 light = normalize(vec3(-1.0, 1.0, 1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = dot(normal, light);

  vec3 hsv = vec3(0.82 + diff * 0.35, 0.8 - diff * 0.4, 0.5 + diff * 0.5);
  vec3 rgb = convertHsvToRgb(hsv);

  vec3 color = (rgb + vColor) * (1.0 - renderOutline);
  vec3 colorOutline = vec3(1.0) * renderOutline;

  gl_FragColor = vec4(color + colorOutline, renderOutline);
}
