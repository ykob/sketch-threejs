precision highp float;

varying vec3 vPosition;
varying vec2 vUv;

const vec3 light = vec3(-0.7, 0.7, -0.7); // For Flat Shading

void main() {
  // Flat Shading
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = (dot(normal, light) + 1.0) / 2.0;

  gl_FragColor = vec4(1.0);
}
