precision highp float;

varying float vOpacity;

void main() {
  vec3 color = vec3(0.0);

  gl_FragColor = vec4(color, vOpacity);
}
