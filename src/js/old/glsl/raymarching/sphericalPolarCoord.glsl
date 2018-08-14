vec3 sphericalPolarCoord(float radius, float radian1, float radian2) {
  return vec3(
    radius * sin(radian1) * cos(radian2),
    radius * sin(radian1) * sin(radian2),
    radius * cos(radian1)
  );
}
#pragma glslify: export(sphericalPolarCoord)
