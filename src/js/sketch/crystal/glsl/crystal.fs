#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec3 hsv;
uniform float time;
uniform sampler2D normalMap;
uniform sampler2D surfaceTex;
uniform sampler2D fogTex;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  // Get normal vector from the normal map.
  vec3 n = texture2D(normalMap, vUv).xyz;

  // Flat Shading
  vec3 light = normalize(vec3(-1.0, 1.0, -1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float diff = (dot(normal + n, light) + 1.0) / 2.0;

  // the pointyness color
  vec3 surface = texture2D(surfaceTex, vUv).rgb;
  vec4 fog1 = texture2D(fogTex, vUv + vec2(0.0, time * 0.06));
  vec4 fog2 = texture2D(fogTex, vUv + vec2(0.0, time * -0.03));
  vec4 fog3 = texture2D(fogTex, vUv + vec2(0.0, time * 0.03));
  vec4 fog4 = texture2D(fogTex, vUv + vec2(0.0, time * -0.06));

  vec3 rgb = convertHsvToRgb(hsv + vec3((fog3.r + fog4.r - 1.0) * 0.16, (1.0 - surface.r) * 0.05, surface.r + (fog1.r + fog2.g - 1.0) + 0.5));
  vec3 color = rgb;

  gl_FragColor = vec4(color, 1.0);
}
