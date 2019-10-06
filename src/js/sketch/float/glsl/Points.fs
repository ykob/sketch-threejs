precision highp float;

uniform float alpha;

void main() {
  // Convert PointCoord to the other vec2 has a range from -1.0 to 1.0.
  vec2 p = gl_PointCoord * 2.0 - 1.0;

  // Draw circle
  float radius = length(p);
  float opacity = (1.0 - smoothstep(0.2, 1.0, radius)) * 0.1
    * smoothstep(0.0, 0.1, alpha)
    * (1.0 - smoothstep(0.5, 1.0, alpha));

  // Define Colors
  vec3 color = vec3(1.0);

  gl_FragColor = vec4(color, opacity);
}
