uniform float time;

vec3 getPolarCoord(float rad1, float rad2, float r) {
  return vec3(
    cos(rad1) * cos(rad2) * r,
    sin(rad1) * r,
    cos(rad1) * sin(rad2) * r
  );
}

void main() {
  vec3 update_position = getPolarCoord(
    position.x,
    position.y + radians(time / 2.0),
    position.z + sin(radians(time * 2.0) + position.x + position.y) * position.z / 4.0
  );
  vec4 mv_position = modelViewMatrix * vec4(update_position, 1.0);

  gl_PointSize = 2.0 * (1000.0 / length(mv_position.xyz));
  gl_Position = projectionMatrix * mv_position;
}
