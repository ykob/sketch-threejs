attribute float radius;
attribute float radian;
attribute float scale;

uniform float time;

varying vec3 vPosition;
varying mat4 vInvertMatrix;

#pragma glslify: inverse = require(glsl-inverse);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: translateMatrix = require(../../../old/glsl/translate_matrix);
#pragma glslify: rotationMatrix = require(../../../old/glsl/rotation_matrix);
#pragma glslify: scaleMatrix = require(../../../old/glsl/scale_matrix);

vec4 move(vec3 position) {
  return translateMatrix(
    vec3(
      cos(radians(time * 0.5) + radian) * radius,
      sin(radians(time * 0.5) + radian * 10.0) * radius * 0.3,
      sin(radians(time * 0.5) + radian) * radius
    )
  ) * rotationMatrix(
    radians(time * radian) + radian, radians(time) + radian, radians(time) + radian
  ) * scaleMatrix(
    vec3(20.0 * scale) + vec3(10.0) * snoise3((position + sin(radian)))
  ) * vec4(position, 1.0);
}

void main() {
  vec4 update_position = move(position);
  vPosition = position;
  vInvertMatrix = inverse(rotationMatrix(
    radians(time * radian) + radian, radians(time) + radian, radians(time) + radian
  ));
  gl_Position = projectionMatrix * modelViewMatrix * update_position;
}
