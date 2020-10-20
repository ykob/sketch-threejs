precision highp float;

uniform sampler2D velocity;
uniform sampler2D acceleration;

varying vec2 vUv;

void main(void) {
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 a = texture2D(acceleration, vUv).xyz;
  float init = step(20.0, v.x);

  vec3 f = a;

  gl_FragColor = vec4(f, 1.0);
}
