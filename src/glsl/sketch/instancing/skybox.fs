precision highp float;

uniform samplerCube cubeTex;

varying vec3 vPosition;

void main() {
  vec3 normal = normalize(vPosition);
  vec4 color = textureCube(cubeTex, normal);
  gl_FragColor = color;
}
