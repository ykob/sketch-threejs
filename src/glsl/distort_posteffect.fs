uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

const float mosaic = 16.0;

void main() {
  vec4 color = vec4(0.0);
  vec2 offset = vec2(mod(gl_FragCoord.x, mosaic), mod(gl_FragCoord.y, mosaic));

  for (float x = 0.0; x < mosaic; x++){
    for (float y = 0.0; y < mosaic; y++){
      color += texture2D(texture, vUv - (offset + vec2(x, y)) / resolution);
    }
  }
  gl_FragColor = color / pow(mosaic, 2.0);
}
