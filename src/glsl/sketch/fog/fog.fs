precision highp float;

uniform sampler2D tex;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;
varying float vOpacity;

void main() {
  vec4 texColor = texture2D(tex, vUv);
  float opacity = texColor.a * vOpacity * 0.2;

  gl_FragColor = vec4(texColor.rgb * vColor, opacity);
}
