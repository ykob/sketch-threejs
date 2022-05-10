#extension GL_OES_standard_derivatives : enable
precision highp float;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  // Flat Shading
  vec3 light = normalize(vec3(0.5, 0.5, 1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = (dot(normal, light) + 1.0) / 2.0;
  float glow = smoothstep(0.9, 1.0, diff);

  vec3 hsv = vec3(0.13, 1.0 - glow * 0.8, 0.05 + glow * 0.95);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, vOpacity);
}
