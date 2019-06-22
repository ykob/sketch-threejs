precision highp float;

uniform sampler2D texture;

varying vec3 vColor;
varying float vOpacity;

void main() {
  // convert PointCoord to range from -1.0 to 1.0
  vec2 p = gl_PointCoord * 2.0 - 1.0;

  // draw double circle
  float r = (1.0 - smoothstep(0.95, 1.0, length(p)));

  gl_FragColor = vec4(vColor * r, vOpacity);
}
