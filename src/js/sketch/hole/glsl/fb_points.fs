void main() {
  vec3 n;
  n.xy = gl_PointCoord.xy * 2.0 - 1.0;
  n.z = 1.0 - dot(n.xy, n.xy);
  if (n.z < 0.0) discard;
  gl_FragColor = vec4(1.0);
}
