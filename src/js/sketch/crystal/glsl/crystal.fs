precision highp float;

uniform sampler2D normalMap;
uniform sampler2D surfaceTex;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  // Get normal vector from the normal map.
  vec3 n = texture2D(normalMap, vUv).xyz;

  // Flat Shading
  vec3 light = normalize(vec3(-1.0, 1.0, -1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = dot(normal + n, light);

  // the pointyness color
  vec3 surface = texture2D(surfaceTex, vUv).xyz;

  vec3 color = vec3(1.0, 0.6, 0.6) + surface * 0.4 + diff * 0.8;

  gl_FragColor = vec4(color, 1.0);
}
