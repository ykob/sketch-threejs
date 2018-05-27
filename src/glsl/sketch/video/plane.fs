precision highp float;

uniform sampler2D texVideo;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(texVideo, vUv);
  gl_FragColor = texColor;
}
