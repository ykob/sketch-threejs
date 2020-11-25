precision highp float;

uniform float time;
uniform sampler2D acceleration;
uniform sampler2D velocity;
uniform sampler2D velocityFirst;
uniform sampler2D delay;

varying vec2 vUv;

void main(void) {
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 vf = texture2D(velocityFirst, vUv).xyz;
  float dl = texture2D(delay, vUv).x;

  float init = clamp(step(500.0, v.x), 0.0, 1.0);
  v = (a * step(dl, time) + v) * (1.0 - init) + vf * init;

  float alpha = 1.0 - smoothstep(450.0, 500.0, abs(v.x));

  gl_FragColor = vec4(v, alpha);
}
