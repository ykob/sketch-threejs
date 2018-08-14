precision highp float;

uniform float time;
uniform vec3 cameraPosition;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vColor;

const vec3 light = vec3(0.7);

void main() {
  float diff = (dot(vNormal, light) + 1.0) / 2.0 * 0.25 + 0.75;
  float opacity = (1.0 - (vPosition.z / 1000.0)) * 0.8 + 0.2;
  gl_FragColor = vec4(vColor * diff, opacity);
}
