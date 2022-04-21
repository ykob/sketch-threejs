#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform sampler2D tex;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  // Flat Shading
  vec3 light = normalize(vec3(0.5, 0.5, 1.0));
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  float d = (dot(normal, light) + 1.0) / 2.0;
  float glow = smoothstep(0.85, 1.0, d);
  float shadow = d;

  // define colors.
  vec3 hsv = vec3(0.13, 1.0 - glow * 0.8, (shadow + glow * 6.0) / 8.0);
  vec3 rgb = convertHsvToRgb(hsv);

  vec4 texColor = texture2D(tex, vUv);
  gl_FragColor = vec4(rgb, 1.0) * texColor;
}
