precision highp float;

#if NUM_DIR_LIGHTS > 0
  struct DirectionalLight {
    vec3 direction;
    vec3 color;
  };
  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec3 light = directionalLights[0].color * dot(directionalLights[0].direction, vNormal);

  gl_FragColor = vec4(light, 1.0);
}
