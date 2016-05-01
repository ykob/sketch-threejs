uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform sampler2D texture2;

varying vec2 vUv;

void main() {
  vec2 uv = vec2(
    vUv.x * min(resolution.x / resolution.y, 1.0) - (min(resolution.x / resolution.y, 1.0) - 1.0) / 2.0,
    vUv.y * min(resolution.y / resolution.x, 1.0) - (min(resolution.y / resolution.x, 1.0) - 1.0) / 2.0
  );
  vec4 color = texture2D(texture, vUv);
  if (length(color.rgb) < 0.2) discard;
  gl_FragColor = texture2D(texture2, uv);
}
