uniform float time;

varying vec3 vColor;

void main() {
  vColor = vec3((position.y / 1000.0 + 1.0) * 0.2 + 0.8);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
