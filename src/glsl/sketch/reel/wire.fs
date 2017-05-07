precision highp float;

uniform float time;
uniform vec3 cameraPosition;

varying vec4 vPosition;

void main() {
  float opacity = length(cameraPosition) / length(cameraPosition - vPosition.xyz) - 0.5;
  gl_FragColor = vec4(0.7, 0.7, 0.7, opacity);
}
