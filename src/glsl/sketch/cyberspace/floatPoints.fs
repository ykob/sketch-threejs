precision highp float;

uniform sampler2D texture;

varying vec3 vColor1;
varying vec3 vColor2;
varying float vOpacity;

void main() {
  vec2 resolution = gl_PointCoord * 2.0 - 1.0;
  float radius = length(resolution);

  float r1 = (1.0 - smoothstep(0.95, 1.0, radius));
  float r2 = (1.0 - smoothstep(0.45, 0.5, radius));

  vec3 color1 = vColor1 * (r1 - r2);
  vec3 color2 = vColor2 * r2;
  float opacity = (r1 - r2) * 0.25 + r2 * 0.5;

  // 以下必須の処理
  gl_FragColor = vec4(color1 + color2, opacity);
}
