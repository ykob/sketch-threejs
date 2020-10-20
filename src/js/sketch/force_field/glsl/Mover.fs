precision highp float;

void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float radius = length(p);

  if (radius > 1.0) discard;

  gl_FragColor = vec4(vec3(1.0), 0.1);
}
