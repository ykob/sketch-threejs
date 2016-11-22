vec3 rotateY(vec3 p, float radian) {
  mat3 m = mat3(
    cos(radian), 0.0, sin(radian),
    0.0, 1.0, 0.0,
    -sin(radian), 0.0, cos(radian)
  );
  return m * p;
}
#pragma glslify: export(rotateY)
