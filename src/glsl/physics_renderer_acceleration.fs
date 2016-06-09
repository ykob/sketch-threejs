uniform float time;
uniform sampler2D velocity;
uniform sampler2D acceleration;

varying vec2 vUv;

#define PRECISION 0.000001

vec3 applyDrag(vec3 a, float value) {
  return normalize(a * -1.0 + PRECISION) * length(a) * value;
}

vec3 applyHook(vec3 v, vec3 anchor, float rest_length, float k) {
  return normalize(v - anchor + PRECISION) * (-1.0 * k * (length(v - anchor) - rest_length));
}

void main(void) {
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 anchor = vec3(0.0, 100.0, 0.0);
  vec3 update_a = a + applyHook(v, anchor, 0.0, 0.1);
  gl_FragColor = vec4(update_a + applyDrag(update_a, 0.1), 1.0);
}
