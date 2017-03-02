attribute float mass;

varying vec2 vUv;
varying float vMass;

void main(void) {
  vUv = uv;
  vMass = mass;
  gl_Position = vec4(position, 1.0);
}
