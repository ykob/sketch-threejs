precision highp float;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  vec3 hsv = vec3(0.13, 0.3, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, vOpacity);
}
