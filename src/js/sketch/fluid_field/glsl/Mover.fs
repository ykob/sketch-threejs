precision highp float;

varying vec3 vColor;
varying float vOpacity;

void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float radius = length(p);
  float opacity = 1.0 - smoothstep(0.5, 1.0, radius);

  if (opacity <= 0.0) discard;

  gl_FragColor = vec4(vColor, vOpacity * opacity);
}
