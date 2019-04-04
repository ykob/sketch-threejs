precision highp float;

uniform float time;
uniform sampler2D texture;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  vec2 updateUv = vUv + vec2(
    cos(radians(p.x * 720.0 + time * 40.0)) * 0.004 * (1.0 - abs(p.y)),
    (sin(radians(p.x * 720.0 + time * 60.0)) * 0.012 + cos(radians(p.x * 180.0 + time * 20.0)) * 0.04) * (1.0 - abs(p.y))
    );
  vec4 texColor = texture2D(texture, updateUv);

  vec3 hsv = vec3(
    texColor.r * 0.18 + 0.94,
    0.9,
    texColor.r * 0.65 + 0.35
    );
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, 1.0);
}
