precision highp float;

uniform float time;
uniform sampler2D objOutline;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec4 outlineColor = texture2D(objOutline, vUv);

  gl_FragColor = vec4(1.0, 0.0, 0.0, outlineColor.r * 0.5);
}
