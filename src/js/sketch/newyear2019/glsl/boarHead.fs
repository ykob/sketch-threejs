precision highp float;

uniform float time;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  // Flat Shading
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));

  vec3 light1 = normalize(vec3(0.25, 0.25, 1.0));
  float d1 = (dot(normal, light1) + 1.0) / 2.0;
  float glow1 = smoothstep(0.9, 1.0, d1);

  vec3 light2 = normalize(vec3(-0.25, -0.25, 1.0));
  float d2 = (dot(normal, light2) + 1.0) / 2.0;
  float glow2 = smoothstep(0.9, 1.0, d2);

  // define colors.
  vec3 hsv = vec3(cnoise3(vPosition * 0.05 + time * 0.1) * 0.1 + 0.1, (glow1 + glow2) * 0.8 + 0.2, (glow1 + glow2) * 0.4 + 0.05);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, 1.0);
}
