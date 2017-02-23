uniform vec2 resolution;
uniform sampler2D velocity;
uniform sampler2D acceleration;
uniform vec2 anchor;

varying vec2 vUv;

#define PRECISION 0.000001

#pragma glslify: drag = require(glsl-force/drag)

void main(void) {
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 a2 = a + normalize(vec3(
    anchor.x * resolution.x / 6.0 + PRECISION,
    0.0,
    anchor.y * resolution.y / -2.0 + PRECISION
  ) - v) / 2.0;
  vec3 a3 = a2 + drag(a2, 0.003);
  gl_FragColor = vec4(a3, 1.0);
}
