precision highp float;

uniform vec3 cameraPosition;
uniform float time;
uniform sampler2D texture;

varying vec3 vPosition;
varying vec4 vUv;

void main() {
  vec4 color = texture2DProj(texture, vUv);
  gl_FragColor = color;
}
