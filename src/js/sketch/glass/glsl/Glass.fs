precision highp float;

uniform vec2 resolution;
uniform sampler2D tScene;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying float vEdge;

void main() {
  vec3 light = normalize(vec3(0.2, 1.0, 0.0));
  float diff = dot(vNormal, light) * 0.5 + 0.5;
  vec2 uv = abs(gl_FragCoord.xy / resolution);
  vec4 texColor = texture2D(tScene, uv + vNormal.xy * 0.3);

  gl_FragColor = vec4(texColor.rgb * texColor.rgb * 0.6 + vEdge * 0.55, 1.0);
}
