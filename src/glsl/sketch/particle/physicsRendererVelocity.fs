uniform sampler2D velocity;
uniform sampler2D acceleration;
uniform float time;

varying vec2 vUv;

void main(void) {
  vec3 v = texture2D(acceleration, vUv).xyz + texture2D(velocity, vUv).xyz;
  float vStep = step(1000.0, length(v));
  gl_FragColor = vec4(v * (1.0 - vStep) + normalize(vec3(v.x + cos(time), v.y + sin(time), 0.0)) * 50.0 * vStep, 1.0);
}
