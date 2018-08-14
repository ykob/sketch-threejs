precision highp float;

uniform sampler2D texture;

varying vec3 vColor1;
varying vec3 vColor2;
varying float vOpacity;

void main() {
  // convert PointCoord to range from -1.0 to 1.0
  vec2 p = gl_PointCoord * 2.0 - 1.0;

  // draw double circle
  float radius = length(p);
  float r1 = (1.0 - smoothstep(0.95, 1.0, radius));
  float r2 = (1.0 - smoothstep(0.45, 0.5, radius));
  vec3 color1 = vColor1 * (r1 - r2);
  vec3 color2 = vColor2 * r2;
  vec3 color = color1 + color2;
  float opacity = ((r1 - r2) * 0.25 + r2 * 0.5) * vOpacity;

  gl_FragColor = vec4(color, opacity);
}
