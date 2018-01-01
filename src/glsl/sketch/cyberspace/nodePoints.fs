precision highp float;

varying vec3 vColor;

void main() {
  vec2 resolution = gl_PointCoord * 2.0 - 1.0;
  float radius = length(resolution);
  float r = 1.0 - smoothstep(0.95, 1.0, radius);

  gl_FragColor = vec4(vColor, r * 0.1);
}
