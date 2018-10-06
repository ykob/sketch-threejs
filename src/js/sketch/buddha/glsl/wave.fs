precision highp float;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  // Flat Shading
  vec3 light = normalize(vec3(0.5, 0.5, 1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = (dot(normal, light) + 1.0) / 2.0;
  float glow = smoothstep(0.9, 1.0, diff);
  float shadow = diff;

  vec3 hsv = vec3(0.1, 0.0, 0.05 + (glow * 6.0) / 10.0);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, vOpacity);
}
