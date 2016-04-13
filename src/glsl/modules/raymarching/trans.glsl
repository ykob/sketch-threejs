vec3 trans(vec3 p) {
  return mod(vec3(p), 4.0) - 2.0;
}
#pragma glslify: export(trans)
