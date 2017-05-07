precision highp float;

uniform float time;
uniform vec3 cameraPosition;

varying vec4 vPosition;
varying vec3 vColor;

void main() {
  float opacity = length(cameraPosition) / length(cameraPosition - vPosition.xyz) - 0.5;
  gl_FragColor = vec4(vColor, opacity);
}
