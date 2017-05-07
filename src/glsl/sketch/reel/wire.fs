precision highp float;

uniform float time;
uniform vec3 cameraPosition;

varying vec4 vPosition;

const vec3 color = vec3(0.75);

void main() {
  float opacity = length(cameraPosition) / length(cameraPosition - vPosition.xyz) - 0.5;
  gl_FragColor = vec4(color, opacity);
}
