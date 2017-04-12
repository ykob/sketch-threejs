precision highp float;

uniform vec3 cameraPosition;
uniform float time;
uniform samplerCube cubeTex;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vec3 ref = reflect(vPosition - cameraPosition, vNormal);
  vec4 envColor = textureCube(cubeTex, ref);
  gl_FragColor = envColor * vec4(0.8, 1.0, 0.95, 0.7);
}
