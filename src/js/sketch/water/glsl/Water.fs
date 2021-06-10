precision highp float;

uniform float time;
uniform sampler2D tImage;
uniform sampler2D tNormal;
uniform float normalScale;

varying vec2 vUv;

// Blending Normal Map
vec3 blendNormalRNM(vec3 n1, vec3 n2) {
  n1 += vec3(0.0, 0.0, 1.0);
  n2 *= vec3(-1.0, -1.0, 1.0);
  return n1 * dot(n1, n2) / n1.z - n2;
}

void main() {
  // Normal Map
  vec4 mapN1 = texture2D(tNormal, vUv * 0.2 + time * vec2(0.01, -0.01));
  vec4 mapN2 = texture2D(tNormal, vUv * 0.2 - time * vec2(0.01, -0.01));
  vec3 mapN = blendNormalRNM(mapN1.xyz * 2.0 - 1.0, mapN2.xyz * 2.0 - 1.0);
  mapN.xy *= normalScale;

  vec4 tImageColor = texture2D(tImage, vUv + mapN.xy * 0.15);

  gl_FragColor = tImageColor;
}
