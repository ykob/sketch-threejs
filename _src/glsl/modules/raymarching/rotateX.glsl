vec3 rotateX(vec3 p, float radian) {
  mat3 m = mat3(
    1.0, 0.0, 0.0,
    0.0, cos(radian), -sin(radian),
    0.0, sin(radian), cos(radian)
  );
  return m * p;
}
#pragma glslify: export(rotateX)
