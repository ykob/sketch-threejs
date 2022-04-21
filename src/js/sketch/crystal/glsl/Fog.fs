precision highp float;

uniform float time;
uniform float hex;
uniform sampler2D fogTex;
uniform vec2 direction;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  vec2 p = vUv * 2.0 - 1.0;

  vec4 fog1 = texture2D(fogTex, vUv - direction * time * 0.05);
  vec4 fog2 = texture2D(
    fogTex,
    vUv
    + direction * time * 0.025
    + vec2(
      cos(radians(fog1.g * 360.0)) * 0.01 * cos(radians(fog1.b * 360.0)),
      sin(radians(fog1.g * 360.0)) * 0.01 * cos(radians(fog1.b * 360.0))
    )
  );
  float opacity = (pow(fog2.r, 2.0) - smoothstep(0.5, 1.0, abs(p.x)) - smoothstep(0.25, 1.0, abs(p.y)));

  vec3 hsv = vec3(hex + fog2.b * 0.16, 0.9, 0.24);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, opacity);
}
