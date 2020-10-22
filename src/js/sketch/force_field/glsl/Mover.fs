precision highp float;

varying vec3 vColor;
varying float vOpacity;

void main() {
  vec2 p = gl_PointCoord * 2.0 - 1.0;
  float radius = length(p);

  if (radius > 1.0) discard;

  gl_FragColor = vec4(vColor, 0.15 * vOpacity);
}
