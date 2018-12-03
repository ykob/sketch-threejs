precision highp float;

uniform float time;

varying vec3 vPosition;
varying vec3 vMPosition;
varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  // Flat Shading
  vec3 normal = normalize(cross(dFdx(vMPosition), dFdy(vMPosition)));

  vec3 light1 = normalize(vec3(0.25, 0.25, 1.0));
  float d1 = (dot(normal, light1) + 1.0) / 2.0;
  float glow1A = smoothstep(0.9, 1.0, d1);
  float glow1B = smoothstep(0.8, 1.0, d1);

  vec3 light2 = normalize(vec3(-0.25, -0.25, 1.0));
  float d2 = (dot(normal, light2) + 1.0) / 2.0;
  float glow2A = smoothstep(0.9, 1.0, d2);
  float glow2B = smoothstep(0.8, 1.0, d2);

  // disolve
  float disolveA = cnoise3(vPosition * 0.06 + time * 0.1) * 0.5 + 0.5;
  float disolveB = cnoise3(vPosition * 0.35 - time * 0.5) * 0.5 + 0.5;
  float disolve1 = smoothstep(0.36, 0.361,
    disolveA * 0.8 + disolveB * 0.2
  );
  float disolve2 = 1.0 - smoothstep(0.35, 0.351,
    disolveA * 0.8 + disolveB * 0.2
  );

  // define colors.
  float h = cnoise3(vPosition * 0.05 + time * 0.1) * 0.1 + 0.05;
  vec3 hsv1 = vec3(
    h,
    (glow1A + glow2A) * 0.8 + 0.2,
    (glow1A + glow2A) * 0.4 + 0.05
  );
  vec3 rgb1 = convertHsvToRgb(hsv1);

  // define colors.
  vec3 hsv2 = vec3(
    h,
    0.45,
    (glow1B + glow2B) * 1.4
  );
  vec3 rgb2 = convertHsvToRgb(hsv2);

  gl_FragColor = vec4(rgb1 * disolve1 + rgb2 * disolve2, 1.0);
}
