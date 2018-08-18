precision highp float;

uniform sampler2D tex;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;
varying float vBlink;

void main() {
  vec2 p = vUv * 2.0 - 1.0;

  vec4 texColor = texture2D(tex, vUv);
  vec3 color = (texColor.rgb - vBlink * length(p) * 0.8) * vColor;
  float opacity = texColor.a * 0.36;

  gl_FragColor = vec4(color, opacity);
}
