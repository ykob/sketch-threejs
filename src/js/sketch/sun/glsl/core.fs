precision highp float;

uniform float time;
uniform sampler2D texture;
uniform sampler2D textureNormal;

varying vec2 vUv;
varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb)

void main() {
  vec2 p = vUv * 2.0 - 1.0;

  vec2 normal = texture2D(textureNormal, vUv + vec2(0.5, 0.0)).xy;
  vec2 updateUv = vUv + vec2(
    cos(radians(normal.x * 360.0 + time * 60.0)) * 0.006,
    sin(radians(normal.y * 360.0 + time * 60.0)) * 0.006
    );

  vec4 texColor = texture2D(texture, updateUv);
  vec3 hsv = vec3(
    texColor.r * 0.14 + 0.03,
    0.95 - texColor.r * 0.7,
    texColor.r * 0.4 + 0.8
    );
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb + vColor, 1.0);
}
