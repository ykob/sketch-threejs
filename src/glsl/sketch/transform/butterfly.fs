precision highp float;

uniform float time;
uniform float size;
uniform sampler2D texture;
uniform float colorH;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;
varying float vStep1;
varying float vStep2;
varying float vStep3;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  vec4 texColor = texture2D(texture, vUv);
  float noise = snoise3(vPosition / vec3(size * 0.25) + vec3(0.0, 0.0, time));
  vec3 hsv = vec3(colorH + noise * 0.2, 0.4, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);

  vec4 color1 = texColor;
  vec4 color2 = vec4(vec3(1.0 + length(texColor.rgb) * texColor.a), 1.0);
  vec4 color3 = vec4(1.0);

  vec4 color = color1 * vStep1 + color2 * vStep2 + color3 * vStep3;

  if (color.a < 0.5) discard;

  gl_FragColor = vec4(rgb, 1.0) * color;
}
