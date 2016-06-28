struct DirectionalLight {
  vec3 color;
  vec3 direction;
};
uniform DirectionalLight directionalLights[1];

varying vec3 vPosition;
varying mat4 vInvertMatrix;

void main() {
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  vec3 inv_light = normalize(vInvertMatrix * vec4(directionalLights[0].direction, 1.0)).xyz;
  float diff = (dot(normal, inv_light) + 1.0) / 2.0;
  gl_FragColor = vec4(vec3(1.0) * diff, 1.0);
}
