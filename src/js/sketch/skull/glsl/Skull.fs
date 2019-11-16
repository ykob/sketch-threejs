precision highp float;

uniform float renderOutline;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  // Flat Shading
  vec3 light = normalize(vec3(-1.0, 1.0, 0.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = dot(normal, light);

  vec3 hsv1 = vec3(0.55, 0.55, 0.48);
  vec3 hsv2 = vec3(0.88, 0.55, 0.9);
  vec3 rgb = mix(convertHsvToRgb(hsv1), convertHsvToRgb(hsv2), diff);

  vec3 color = (rgb + vColor) * (1.0 - renderOutline);
  vec3 colorOutline = vec3(1.0) * renderOutline;

  gl_FragColor = vec4(color + colorOutline, renderOutline);
}
