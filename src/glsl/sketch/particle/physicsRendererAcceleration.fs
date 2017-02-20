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
  gl_FragColor = vec4(a, 1.0);
}
