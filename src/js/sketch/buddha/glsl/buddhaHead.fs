precision highp float;

uniform sampler2D tex;

varying vec3 vColor;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(tex, vUv);
  gl_FragColor = vec4(vColor, 1.0) * texColor;
}
