#extension GL_OES_standard_derivatives : enable
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
  // Phong Shading
  vec3 normal;
  vec3 diff;
  vec3 lightColor;

  #if NUM_DIR_LIGHT_SHADOWS > 0
    #pragma unroll_loop
    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
      normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
      diff += (dot(normal, directionalLights[ i ].direction) + 1.0) / 2.0;
      lightColor += directionalLights[ i ].color;
    }
  #endif

  vec4 shadow;

  #if NUM_DIR_LIGHT_SHADOWS > 0
    #pragma unroll_loop
    for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
      shadow += texture2DProj(directionalShadowMap[ i ], vDirectionalShadowCoord[ i ]);
    }
  #endif

  gl_FragColor = vec4(lightColor * diff, 1.0) * shadow;
}
