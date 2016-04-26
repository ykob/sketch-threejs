uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

const float scale = 12.0;

void main() {
  vec4 color = vec4(0.0);
  float offsetX = mod(gl_FragCoord.x, scale) / resolution.x;
  float offsetY = mod(gl_FragCoord.y, scale) / resolution.y;

  for(float x = 0.0; x <= scale - 1.0; x += 1.0){
    for(float y = 0.0; y <= scale - 1.0; y += 1.0){
      color += texture2D(texture, vUv - vec2(offsetX, offsetY));
    }
  }
  gl_FragColor = color / pow(scale, 2.0);
}
