attribute vec3 radian;

uniform float time;
uniform vec2 resolution;
uniform float size;

void main() {
  float radius = max(min(resolution.x, resolution.y), 600.0) * cos(radians(time * 2.0) + radian.z);
  float radian_base = radians(time * 2.0);
  vec3 update_positon = position + vec3(
    cos(radian_base + radian.x) * cos(radian_base + radian.y) * radius,
    cos(radian_base + radian.x) * sin(radian_base + radian.y) * radius,
    sin(radian_base + radian.x) * radius
  );
  vec4 mvPosition = modelViewMatrix * vec4(update_positon, 1.0);

  gl_PointSize = size * abs(sin(radian_base + radian.z)) * (size / length(mvPosition.xyz)) * min(resolution.x, resolution.y);
  gl_Position = projectionMatrix * mvPosition;
}
