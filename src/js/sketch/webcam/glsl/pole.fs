precision highp float;

varying vec3 vPosition;
varying float vOpacity;

void main() {
  // Flat Shading
  vec3 light = normalize(vec3(0.0, 1.0, 0.5));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = (dot(normal, light) + 1.0) / 2.0;

  vec3 color = vec3(0.9) + diff * 0.1;

  gl_FragColor = vec4(color, vOpacity);
}
