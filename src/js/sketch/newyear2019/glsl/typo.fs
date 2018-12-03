precision highp float;

uniform sampler2D tex;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(tex, vUv);

  if (texColor.a < 0.5) discard;
  gl_FragColor = vec4(texColor.rgb, texColor.a * 0.02);
}
