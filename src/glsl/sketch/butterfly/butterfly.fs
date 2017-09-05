precision highp float;

uniform float time;
uniform sampler2D texture;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  vec4 texColor = texture2D(texture, vUv);

  float noise = snoise3(vPosition / vec3(40.0) + vec3(0.0, 0.0, time));
  vec3 hsv = vec3(1.0 + noise * 0.3 + time * 0.2, 0.4, (vPosition.y + 100.0) / 200.0 + 0.5);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, 1.0) * texColor;
}
