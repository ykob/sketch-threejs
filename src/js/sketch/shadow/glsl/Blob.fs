precision highp float;

uniform vec3 cameraPosition;

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
varying vec3 vColor;
varying mat4 invertMatrix;

void main() {
  // Phong Shading
  vec3 diff;
  vec3 specular;
  vec3 invLight;
  vec3 invEye;
  vec3 halfLE;

  #if NUM_DIR_LIGHT_SHADOWS > 0
    #pragma unroll_loop
    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
      invLight = normalize(invertMatrix * vec4(directionalLights[ i ].direction, 0.0)).xyz;
      invEye = normalize(invertMatrix * vec4(cameraPosition, 0.0)).xyz;
      diff += clamp(dot(vNormal, invLight), 0.0, 1.0);

      halfLE = normalize(invLight + invEye);
      specular += directionalLights[ i ].color * pow(max(dot(vNormal, halfLE), 0.0), 30.0);
    }
  #endif

  vec4 destColor = vec4(vColor * diff + specular, 1.0);

  gl_FragColor    = destColor;
}
