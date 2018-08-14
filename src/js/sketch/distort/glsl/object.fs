varying vec3 vColor;
varying vec3 vNormal;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(../../../old/glsl/hsv2rgb)

struct HemisphereLight {
  vec3 direction;
  vec3 groundColor;
  vec3 skyColor;
};
uniform HemisphereLight hemisphereLights[NUM_HEMI_LIGHTS];

void main() {
  vec3 light = vec3(0.0);
  light += (dot(hemisphereLights[0].direction, vNormal) + 1.0) * hemisphereLights[0].skyColor * 0.5;
  light += (-dot(hemisphereLights[0].direction, vNormal) + 1.0) * hemisphereLights[0].groundColor * 0.5;
  gl_FragColor = vec4(vColor * light, 1.0);
}
