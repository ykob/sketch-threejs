precision highp float;

#if NUM_DIR_LIGHTS > 0
  struct DirectionalLight {
    vec3 direction;
    vec3 color;
  };
  uniform DirectionalLight directionalLightss[ NUM_DIR_LIGHTS ];
#endif

uniform sampler2D directionalShadowMap[NUM_DIR_LIGHT_SHADOWS];

varying vec3 vPosition;
varying vec2 vUv;
varying vec4 vDirectionalShadowCoord[NUM_DIR_LIGHT_SHADOWS];

void main() {
  // Flat Shading
  // vec3 light = normalize(vec3(-1.0, 1.0, -1.0));
  // vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  // float diff = (dot(normal, light) + 1.0) / 2.0;

  vec4 shadow = texture2D(
    directionalShadowMap[0],
    vUv
    );

  gl_FragColor = vec4(shadow.a);
}
