float dBox(vec3 p, vec3 size) {
  return length(max(abs(p) - size, 0.0));
}
#pragma glslify: export(dBox)
