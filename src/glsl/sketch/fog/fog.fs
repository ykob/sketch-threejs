precision highp float;

uniform sampler2D tex;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

void main() {
  vec4 texColor = texture2D(tex, vUv);
  float opacity = texColor.a * vOpacity * 0.12;

  gl_FragColor = vec4(texColor.rgb, opacity);
}
