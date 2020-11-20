precision highp float;

uniform sampler2D acceleration;
uniform sampler2D velocity;

varying vec2 vUv;

void main(void) {
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 v2 = a + v;

  gl_FragColor = vec4(v2, 1.0);
}
