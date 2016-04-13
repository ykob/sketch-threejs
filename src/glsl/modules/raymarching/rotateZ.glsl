vec3 rotateZ(vec3 p, float radian) {
  mat3 m = mat3(
    cos(radian), -sin(radian), 0.0,
    sin(radian), cos(radian), 0.0,
    0.0, 0.0, 1.0
  );
  return m * p;
}
#pragma glslify: export(rotateZ)
