precision highp float;

varying vec3 vColor;
varying float vOpacity;

void main() {
  // Convert PointCoord to a range from -1.0 to 1.0
  vec2 p = gl_PointCoord * 2.0 - 1.0;

  // Draw double circle
  float radius = length(p);
  float opacity = (1.0 - smoothstep(0.2, 1.0, radius)) * vOpacity;

  gl_FragColor = vec4(vColor, opacity);
}
