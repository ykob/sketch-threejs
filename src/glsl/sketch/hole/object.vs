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
    vec3(cos(radians(time)) * 400.0, 0.0, sin(radians(time)) * 400.0)
  ) * rotationMatrix(
    radians(time), radians(time), radians(time)
  ) * scaleMatrix(vec3(20.0)) * vec4(position, 1.0);
}

void main() {
  vec4 update_position = move(position);
  vPosition = position;
  vInvertMatrix = inverse(rotationMatrix(radians(time), radians(time), radians(time)));
  gl_Position = projectionMatrix * modelViewMatrix * update_position;
}
