uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform sampler2D texture2;

const float blur = 10.0;

varying vec2 vUv;

void main() {
  vec2 uv = vec2(
    vUv.x * min(resolution.x / resolution.y, 1.0) - (min(resolution.x / resolution.y, 1.0) - 1.0) / 2.0,
    vUv.y * min(resolution.y / resolution.x, 1.0) - (min(resolution.y / resolution.x, 1.0) - 1.0) / 2.0
  );
  vec4 color = vec4(0.0);
  for (float x = 0.0; x < blur; x++){
    for (float y = 0.0; y < blur; y++){
      color += texture2D(texture, vUv - (vec2(x, y) - vec2(blur / 2.0)) / resolution);
    }
  }
  vec4 color2 = color / pow(blur, 2.0);
  vec4 color3 = texture2D(texture2, uv);
  gl_FragColor = vec4(color3.rgb, length(color2.rgb));
}
