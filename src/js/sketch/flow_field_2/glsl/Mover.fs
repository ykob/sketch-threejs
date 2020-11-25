precision highp float;

varying vec3 vColor;
varying float vOpacity;

void main() {
  if (vOpacity <= 0.01) discard;

  gl_FragColor = vec4(vColor, vOpacity);
}
