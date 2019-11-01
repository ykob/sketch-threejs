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
  vec3 invLight = normalize(invertMatrix * vec4(directionalLights[0].direction, 0.0)).xyz;
  vec3 invEye = normalize(invertMatrix * vec4(cameraPosition, 0.0)).xyz;
  float diffuse = clamp(dot(vNormal, invLight), 0.0, 1.0);

  vec3 halfLE = normalize(invLight + invEye);
  vec3 specular = directionalLights[0].color * pow(max(dot(vNormal, halfLE), 0.0), 30.0);

  vec4 destColor = vec4(vColor * diffuse + specular, 1.0);

  gl_FragColor    = destColor;
}
