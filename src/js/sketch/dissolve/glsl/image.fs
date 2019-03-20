precision highp float;

uniform sampler2D textures[5];

varying vec2 vUv;

vec4 getTexColor(float index, vec2 uv) {
  vec4 color;
  color += texture2D(textures[0], uv) * (1.0 - step(0.9, index));
  color += texture2D(textures[1], uv) * step(1.0, index) * (1.0 - step(1.9, index));
  color += texture2D(textures[2], uv) * step(2.0, index) * (1.0 - step(2.9, index));
  color += texture2D(textures[3], uv) * step(3.0, index) * (1.0 - step(3.9, index));
  color += texture2D(textures[4], uv) * step(4.0, index) * (1.0 - step(4.9, index));
  return color;
}

void main(void) {
  gl_FragColor = getTexColor(0.0, vUv);
}
