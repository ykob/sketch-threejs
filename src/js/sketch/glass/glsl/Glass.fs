precision highp float;

uniform vec2 resolution;
uniform sampler2D tScene;
uniform sampler2D tDisplace;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying float vEdge;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  vec3 light = normalize(vec3(0.2, 1.0, 0.0));
  float diff = dot(vNormal, light) * 0.5 + 0.5;
  vec2 uv = abs(gl_FragCoord.xy / resolution);
  vec4 tSceneColor = texture2D(tScene, uv + vNormal.xy * 0.3);
  vec4 tDisplaceColor = texture2D(tDisplace, vUv);
  float str =
    length(1.0 - tDisplaceColor.rgb) * 0.45 +
    vEdge * 0.55;
  vec3 hsv = vec3(
    0.1,
    0.8 - str * 0.7,
    0.1 + str * 0.7
  );
  vec3 rgb = convertHsvToRgb(hsv);
  vec3 color = rgb + tSceneColor.rgb * tSceneColor.rgb * 0.6;

  gl_FragColor = vec4(color, 1.0);
}
