precision highp float;

uniform sampler2D acceleration;
uniform sampler2D velocity;

varying vec2 vUv;

void main(void) {
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 v = texture2D(velocity, vUv).xyz;

  gl_FragColor = vec4(v + a, 1.0);
}
