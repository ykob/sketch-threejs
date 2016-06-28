uniform float time;

varying vec3 vPosition;
varying mat4 vInvertMatrix;

#pragma glslify: inverse = require(glsl-inverse);
#pragma glslify: rotationMatrix = require(../../modules/rotation_matrix);

vec4 move(vec3 position) {
  vec3 scale = vec3(20.0);
  return mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    cos(radians(time)) * 400.0, 0.0, sin(radians(time)) * 400.0, 1.0
  ) * rotationMatrix(radians(time), radians(time), radians(time)) * mat4(
    scale.x, 0.0, 0.0, 0.0,
    0.0, scale.y, 0.0, 0.0,
    0.0, 0.0, scale.z, 0.0,
    0.0, 0.0, 0.0, 1.0
  ) * vec4(position, 1.0);
}

void main() {
  vec4 update_position = move(position);
  vPosition = position;
  vInvertMatrix = inverse(rotationMatrix(radians(time), radians(time), radians(time)));
  gl_Position = projectionMatrix * modelViewMatrix * update_position;
}
