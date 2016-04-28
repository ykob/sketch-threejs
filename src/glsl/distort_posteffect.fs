uniform vec2 resolution;
uniform sampler2D texture;

const float blur = 16.0;

varying vec2 vUv;

void main() {
  float r = texture2D(texture, vUv).r;
  float g = texture2D(texture, vUv + vec2(-50.0, 0.0) / resolution).g;
  float b = texture2D(texture, vUv + vec2(50.0, 0.0) / resolution).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}
