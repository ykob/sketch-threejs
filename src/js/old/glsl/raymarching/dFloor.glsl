float dFloor(vec3 p) {
  return dot(p, vec3(0.0, 1.0, 0.0)) + 1.0;
}
#pragma glslify: export(dFloor)
