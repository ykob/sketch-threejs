precision highp float;

uniform sampler2D acceleration;
uniform sampler2D velocity;
uniform sampler2D velocityFirst;

varying vec2 vUv;

void main(void) {
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 vf = texture2D(velocityFirst, vUv).xyz;

  float init = clamp(step(30.0, abs(v.x)) + step(30.0, abs(v.y)) + step(30.0, abs(v.z)), 0.0, 1.0);
  v = (a + v) * (1.0 - init) + vf * init;

  gl_FragColor = vec4(v, 1.0);
}
