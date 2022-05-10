#extension GL_OES_standard_derivatives : enable
precision highp float;

varying vec3 vPosition;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  // Flat Shading
  vec3 light = normalize(vec3(-1.0, 1.0, 1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = (dot(normal, light) + 1.0) / 2.0;

  vec3 hsv = vec3(0.0, 0.0, 0.8 + diff * 0.2);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, 1.0);
}
