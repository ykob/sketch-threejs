#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec3 cameraPosition;
uniform float time;

varying vec3 vPosition;
varying mat4 vInvertMatrix;

void main() {
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  vec3 light = vec3(-0.7, 0.7, -0.7);
  float diff = (dot(normal, light) + 1.0) / 2.0 * 0.2 + 0.8;
  gl_FragColor = vec4(vec3(0.98) * diff, 1.0);
}
