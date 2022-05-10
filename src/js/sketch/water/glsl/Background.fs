precision highp float;

varying vec3 vPosition;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb)

void main() {
  float alpha = vPosition.z / 100.0 * 0.5 + 0.5;
  vec3 hsv1 = vec3(0.49, 0.5, 0.7);
  vec3 hsv2 = vec3(1.1, 0.1, 0.9);
  vec3 rgb = mix(convertHsvToRgb(hsv1), convertHsvToRgb(hsv2), alpha);

  gl_FragColor = vec4(rgb, 1.0);
}
