// #extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float time;
uniform sampler2D tNormal;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec3 normal1 = texture2D(tNormal, vUv + vec2(0.0, time * 0.02)).xyz;
  vec3 normal2 = texture2D(tNormal, vUv + vec2(0.5, 0.0) + vec2(0.0, time * -0.02)).xyz;
  vec3 normal = normalize(normal1 + normal2);
  vec3 light = normalize(vec3(0.0, 1.0, 0.0));
  float diff = dot(normal, light);

  gl_FragColor = vec4(vec3(diff) + vec3(0.0, 0.3, 0.8), 1.0);
}
