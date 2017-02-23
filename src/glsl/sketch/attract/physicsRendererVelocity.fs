uniform float time;
uniform sampler2D velocity;
uniform sampler2D acceleration;

varying vec2 vUv;

void main(void) {
  gl_FragColor = vec4(texture2D(acceleration, vUv).xyz + texture2D(velocity, vUv).xyz, 1.0);
}
