attribute float radius;
attribute float radian;

uniform float time;

varying vec3 vPosition;
varying mat4 vInvertMatrix;

#pragma glslify: inverse = require(glsl-inverse);
#pragma glslify: translateMatrix = require(../../modules/translate_matrix);
#pragma glslify: rotationMatrix = require(../../modules/rotation_matrix);
#pragma glslify: scaleMatrix = require(../../modules/scale_matrix);

vec4 move(vec3 position) {
  vec3 scale = vec3(20.0);
  return translateMatrix(
    vec3(
      cos(radians(time) + radian) * radius,
      sin(radians(time) + radian * 10.0) * radius * 0.3,
      sin(radians(time) + radian) * radius
    )
  ) * rotationMatrix(
    radians(time) + radian, radians(time) + radian, radians(time) + radian
  ) * scaleMatrix(vec3(20.0)) * vec4(position, 1.0);
}

void main() {
  vec4 update_position = move(position);
  vPosition = position;
  vInvertMatrix = inverse(rotationMatrix(
    radians(time) + radian, radians(time) + radian, radians(time) + radian
  ));
  gl_Position = projectionMatrix * modelViewMatrix * update_position;
}
