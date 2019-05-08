precision highp float;

uniform vec3 hsv;
uniform sampler2D normalMap;
uniform sampler2D surfaceTex;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  // Get normal vector from the normal map.
  vec3 n = texture2D(normalMap, vUv).xyz;

  // Flat Shading
  vec3 light = normalize(vec3(-1.0, 1.0, -1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = (dot(normal + n, light) + 1.0) / 2.0;

  // the pointyness color
  vec3 surface = texture2D(surfaceTex, vUv).xyz;

  vec3 rgb = convertHsvToRgb(hsv + vec3(0.0, (1.0 - surface.r) * 0.2, diff));
  vec3 color = rgb;

  gl_FragColor = vec4(color, 1.0);
}
