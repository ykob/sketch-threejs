precision highp float;

#if NUM_DIR_LIGHTS > 0
  struct DirectionalLight {
    vec3 direction;
    vec3 color;
  };
  uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

uniform sampler2D directionalShadowMap[NUM_DIR_LIGHT_SHADOWS];

varying vec3 vPosition;
varying vec2 vUv;
varying vec4 vDirectionalShadowCoord[NUM_DIR_LIGHT_SHADOWS];

void main() {
  // Flat Shading
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = (dot(normal, directionalLights[0].direction) + 1.0) / 2.0;

  vec4 shadow = texture2DProj(directionalShadowMap[0], vDirectionalShadowCoord[0]);

  gl_FragColor = vec4(vec3(diff * shadow.a), 1.0);
}
