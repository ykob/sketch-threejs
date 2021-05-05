precision highp float;

varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  vec3 hsv = vec3(
    0.8 - vUv.y * 0.5,
    0.5,
    0.9
  );
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, 1.0);
}
