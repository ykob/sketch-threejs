precision highp float;

uniform sampler2D velocity;
uniform sampler2D acceleration;

varying vec2 vUv;

void main(void) {
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 v = texture2D(velocity, vUv).xyz;

  float limit = step(20.0, v.x);
  v.x = v.x * (1.0 - limit) + -20.0 * limit;

  gl_FragColor = vec4(a + v, 1.0);
}
