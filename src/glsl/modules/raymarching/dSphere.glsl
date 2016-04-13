float dSphere(vec3 p, float r) {
  return length(p) - r;
}
#pragma glslify: export(dSphere)
