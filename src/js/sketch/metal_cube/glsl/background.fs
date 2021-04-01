#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform float acceleration;

varying vec3 vPosition;
varying vec3 vColor;
varying mat4 invertMatrix;

void main() {
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  vec3 inv_light = normalize(invertMatrix * vec4(0.7, -0.7, 0.7, 1.0)).xyz;
  float diff = (dot(normal, inv_light) + 1.0) / 4.0 + 0.4;
  gl_FragColor = vec4(vColor * diff, 1.0);
}
