precision highp float;

varying vec3 vNormal;

void main() {
  vec3 light = normalize(vec3(1.0, 1.0, -0.5));
  float diff = dot(vNormal, light);
  vec3 color = vec3(0.5) + diff * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
