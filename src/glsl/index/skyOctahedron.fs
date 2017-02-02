precision highp float;

uniform mat3 normalMatrix;
uniform float time;

varying vec3 vPosition;
varying float vNow;

const vec3 lightDirection = vec3(1.0, -1.0, -1.0);
const float duration = 1.0;
const float delay = 2.0;

void main() {
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  vec3 light = normalize(normalMatrix * lightDirection);
  float diff = (dot(normal, light) + 1.0) / 2.0 * 0.5 + 0.5;
  float opacity = smoothstep(0.1, 0.2, vNow);
  gl_FragColor = vec4(vec3(1.0) * diff, opacity);
}
