// #extension GL_OES_standard_derivatives : enable
precision highp float;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  // Flat Shading
  // vec3 light = normalize(vec3(-1.0, 1.0, -1.0));
  // vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  // float diff = dot(normal, light);

  gl_FragColor = vec4(1.0);
}
