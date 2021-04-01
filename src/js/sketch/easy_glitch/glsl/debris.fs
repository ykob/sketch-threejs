#extension GL_OES_standard_derivatives : enable
precision highp float;

varying vec3 vPosition;

void main() {
  vec3 light = normalize(vec3(1.0, 1.0, 1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = pow((dot(normal, light) + 1.0) / 2.0, 3.0);

  vec3 rgb = vec3(10.0 / 255.0, 20.0 / 255.0, 38.0 / 255.0);

  gl_FragColor = vec4(rgb + diff * 0.2, 1.0);
}
