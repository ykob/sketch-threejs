uniform sampler2D velocity;
uniform sampler2D acceleration;
uniform float time;

varying vec2 vUv;

#pragma glslify: polar = require(@ykob/glsl-util/src/polar)

const float radius = 100.0;

void main(void) {
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 v = texture2D(velocity, vUv).xyz;
  float vStep = step(0.000001, length(a));
  gl_FragColor = vec4(
    (a + v) * vStep + normalize(v + polar(time, -time, 1.0)) * radius * (1.0 - vStep),
    1.0
  );
}
