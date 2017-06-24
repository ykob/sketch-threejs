precision highp float;

uniform float time;

varying vec3 vPosition;
varying mat4 vInvertMatrix;

const vec3 light = vec3(0.7);

void main() {
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  vec3 light = normalize(vInvertMatrix * vec4(vec3(-1000.0, 1000.0, -1000.0), 1.0)).xyz;
  float diff = (dot(normal, light) + 1.0) / 2.0 * 0.2 + 0.8;
  gl_FragColor = vec4(vec3(1.0) * diff, 1.0);
}
