attribute vec3 radian;

uniform float time;
uniform vec2 resolution;
uniform float size;
uniform vec2 force;

void main() {
  float radius = 300.0;
  float radian_base = radians(time * 2.0);
  vec3 update_positon = position + vec3(
    cos(radian_base + radian.x) * cos(radian_base + radian.y) * radius,
    cos(radian_base + radian.x) * sin(radian_base + radian.y) * radius,
    sin(radian_base + radian.x) * radius
  ) * force.x;
  vec4 mvPosition = modelViewMatrix * vec4(update_positon, 1.0);

  gl_PointSize = (size + force.y) * (abs(sin(radian_base + radian.z))) * (size / length(mvPosition.xyz)) * 480.0;
  gl_Position = projectionMatrix * mvPosition;
}
