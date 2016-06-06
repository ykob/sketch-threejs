uniform float time;
uniform sampler2D acceleration;

varying vec2 vUv;

void main(void) {
  vec3 gravity = vec3(0.0, 1.0, 0.0);
  vec3 update_position = texture2D(acceleration, vUv).xyz + gravity;
  gl_FragColor = vec4(update_position, 1.0);
}
