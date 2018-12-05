precision highp float;

uniform float time;
uniform float drawBrightOnly;
uniform float dissolveEdge;

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

  // dissolve
  float dissolveA = cnoise3(
    vec3(
      vPosition.x * 0.06,
      (vPosition.y - vPosition.x * 0.5 + vPosition.z * 0.5) * 0.18,
      vPosition.z * 0.06
    ) + time * 0.02
  ) * 0.5 + 0.5;
  float dissolveB = cnoise3(
    vec3(
      vPosition.x * 0.2,
      (vPosition.y - vPosition.x * 0.5 + vPosition.z * 0.5) * 0.4,
      vPosition.z * 0.2
    ) + time * 0.04
  ) * 0.5 + 0.5;
  float dissolveC = cnoise3(
    vec3(
      vPosition.x * 0.5,
      (vPosition.y - vPosition.x * 0.5 + vPosition.z * 0.5) * 1.2,
      vPosition.z * 0.5
    )
  ) * 0.5 + 0.5;
  float dissolve1 = smoothstep(0.36 + dissolveEdge, 0.365 + dissolveEdge,
    dissolveA * 0.7 + dissolveB * 0.2 + dissolveC * 0.1
  );
  float dissolve2 = 1.0 - smoothstep(0.35 + dissolveEdge, 0.355 + dissolveEdge,
    dissolveA * 0.7 + dissolveB * 0.2 + dissolveC * 0.1
  );

  // define colors.
  float h = dissolveA * 0.24 - 0.1;
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
    (glow1B + glow2B) * 1.2
  );
  vec3 rgb2 = convertHsvToRgb(hsv2);

  gl_FragColor = vec4(rgb1 * dissolve1 * (1.0 - drawBrightOnly) + rgb2 * dissolve2, 1.0);
}
