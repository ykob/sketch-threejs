precision highp float;

uniform float time;
uniform float size;
uniform sampler2D texButterfly;
uniform sampler2D texPicture;
uniform float colorH;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;
varying float vStep1;
varying float vStep2;
varying float vStep3;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: random = require(@ykob/glsl-util/src/random);
#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

const float rgbDiff = 0.01;

void main() {
  // Glitch Noise.
  float bnStrength = sin(time) * 0.05;
  float bnTime = floor(time * 18.0) * 200.0;
  float noiseX = step(0.87 + bnStrength, (snoise3(vec3(0.0, vUv.x * 1.8, bnTime)) + 1.0) / 2.0);
  float noiseY = step(0.87 + bnStrength, (snoise3(vec3(0.0, vUv.y * 4.2, bnTime)) + 1.0) / 2.0);
  float bnMask = noiseX * noiseY;
  float bnUvX = mod(vUv.x + sin(bnTime) + rgbDiff, 1.0);
  vec4 bnDiff = (1.0 - texture2D(texPicture, vec2(bnUvX, vUv.y))) * bnMask;

  // White Noise.
  float whiteNoise = (random(vUv + mod(time, 10.0)) * 2.0 - 1.0) * 0.15;
  vec4 wnColor = vec4(vec3(whiteNoise), 0.0);

  // Color Noise for BUterfly.
  float noise = snoise3(vPosition / vec3(size * 0.25) + vec3(0.0, 0.0, time));
  vec3 hsv = vec3(colorH + noise * 0.2, 0.4, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);

  // Butterly Color.
  vec4 texButterflyColor = texture2D(texButterfly, vUv);
  vec4 color1 = vec4(rgb, 1.0) * texButterflyColor;

  // Sphere color on transforming.
  vec4 color2 = vec4(rgb, 1.0) * vec4((1.0 - texButterflyColor.rgb * 0.5), texButterflyColor.a) + wnColor;

  // Picture Color.
  vec2 pictUv = vUv * 1.1 - 0.05;
  vec4 texPictureColor = texture2D(texPicture, pictUv);
  float pictAlpha = step(0.0, pictUv.x) * (1.0 - step(1.0, pictUv.x)) * step(0.0, pictUv.y) * (1.0 - step(1.0, pictUv.y));
  vec4 pictColor = texPictureColor * (1.0 - bnMask) * vec4(vec3(1.0), pictAlpha);
  vec4 bnColor = vec4(bnDiff.rgb * 1.2, bnMask);
  vec4 color3 = pictColor + bnColor + wnColor;

  // total of colors.
  vec4 color = (color1 * vStep1 + color2 * vStep2) + color3 * vStep3;

  if (color.a < 0.5) discard;

  gl_FragColor = color;
}
