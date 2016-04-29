uniform float time;
uniform vec2 resolution;
uniform float acceleration;
uniform sampler2D texture;

const float blur = 16.0;

varying vec2 vUv;

void main() {
  float diff = 250.0 * length(acceleration);
  float r = texture2D(texture, vUv).r;
  float g = texture2D(texture, vUv + vec2(cos(time), sin(time)) * diff / resolution).g;
  float b = texture2D(texture, vUv + vec2(cos(-time), sin(-time)) * diff / resolution).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}
