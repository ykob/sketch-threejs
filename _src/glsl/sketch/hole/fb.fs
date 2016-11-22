uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform sampler2D texture2;

const float blur = 20.0;

varying vec2 vUv;

void main() {
  vec4 color = vec4(0.0);
  for (float x = 0.0; x < blur; x++){
    for (float y = 0.0; y < blur; y++){
      color += texture2D(texture, vUv - (vec2(x, y) - vec2(blur / 2.0)) / resolution);
    }
  }
  vec4 color2 = color / pow(blur, 2.0);
  vec4 color3 = texture2D(texture2, vUv);
  gl_FragColor = vec4(color3.rgb, floor(length(color2.rgb)));
}
