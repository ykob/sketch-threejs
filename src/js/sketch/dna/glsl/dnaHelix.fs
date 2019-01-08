precision highp float;

varying vec3 vColor;

void main() {
  // Convert PointCoord to the other vec2 has a range from -1.0 to 1.0.
  vec2 p = gl_PointCoord * 2.0 - 1.0;

  // Draw circle
  float radius = length(p);
  float opacity1 = (1.0 - smoothstep(0.5, 0.7, radius));
  float opacity2 = smoothstep(0.8, 1.0, radius) * (1.0 - smoothstep(1.0, 1.2, radius));

  gl_FragColor = vec4(vColor, (opacity1 + opacity2) * 0.5);
}
