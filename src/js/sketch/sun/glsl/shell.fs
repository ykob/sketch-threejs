precision highp float;

uniform float time;
uniform sampler2D texture;
uniform sampler2D textureNormal;

varying vec2 vUv;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb)

void main() {
  vec2 p = vUv * 2.0 - 1.0;

  vec2 normal = texture2D(textureNormal, vUv + vec2(0.5, 0.0)).xy;
  vec2 updateUv = vUv + vec2(
    cos(radians(normal.x * 360.0 + time * 60.0)) * 0.018,
    sin(radians(normal.y * 360.0 + time * 60.0)) * 0.018
    );

  vec4 texColor = texture2D(texture, updateUv);
  float opacity = texColor.r * vOpacity;
  vec3 hsv = vec3(
    opacity * 0.1 + 0.03,
    0.95 - opacity * 0.7,
    opacity * 0.4 + 0.8
    );
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, smoothstep(0.3, 0.9, opacity) * 0.9);
}
