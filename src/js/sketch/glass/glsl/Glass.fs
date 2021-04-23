precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D tScene;
uniform sampler2D tRoughness;
uniform sampler2D tNoise;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying float vEdge;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  vec2 uv = gl_FragCoord.xy / resolution * 0.7 + 0.15;
  vec4 tSceneColor = texture2D(tScene, uv + vNormal.xy * 0.3);
  vec4 tRoughnessColor = texture2D(tRoughness, vUv);
  vec4 tNoiseColor = texture2D(tNoise, vUv);
  float str =
    length(tRoughnessColor.r) * 0.8 +
    vEdge * 0.5;
  vec3 hsv = vec3(
    0.45 + sin(radians(tNoiseColor.r * 360.0) + time) * 0.08 + cos(radians(tNoiseColor.g * 360.0) + time * 2.0) * 0.08,
    0.25 - str * 0.24,
    0.05 + str * 0.95
  );
  vec3 rgb = convertHsvToRgb(hsv);
  vec3 color = rgb + tSceneColor.rgb * tSceneColor.rgb * tSceneColor.rgb * 0.7 + 0.05;

  gl_FragColor = vec4(color, 1.0);
}
