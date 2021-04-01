#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float time;

varying vec3 vPosition;
varying vec3 vColor;

void main() {
  // flat shading
  vec3 light = normalize(vec3(0.0, 1.0, 1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = pow((dot(normal, light) + 1.0) / 2.0, 10.0);

  gl_FragColor = vec4(vColor, diff * 0.4 + 0.03);
}
