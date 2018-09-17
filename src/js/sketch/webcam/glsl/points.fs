precision highp float;

varying vec3 vColor;

void main() {
  // convert PointCoord to range from -1.0 to 1.0
  vec2 p = gl_PointCoord * 2.0 - 1.0;

  float r = 1.0 - smoothstep(0.5, 1.0, length(p));

  gl_FragColor = vec4(vColor, r);
}
