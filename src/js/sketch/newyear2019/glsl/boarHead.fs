#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float time;
uniform float drawBrightOnly;
uniform float dissolveEdge;

varying vec3 vPosition;
varying vec3 vMPosition;
varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);
#pragma glslify: ease = require(glsl-easings/exponential-out)

void main() {
  // Flat Shading
  vec3 normal = normalize(cross(dFdx(vMPosition), dFdy(vMPosition)));

  vec3 light1 = normalize(vec3(0.0, 0.333, 1.0));
  float d1 = (dot(normal, light1) + 1.0) / 2.0;
  float glow1A = smoothstep(0.875, 1.0, d1);
  float glow1B = smoothstep(0.75, 1.0, d1) * 0.8;

  vec3 light2 = normalize(vec3(-0.0, -0.333, 1.0));
  float d2 = (dot(normal, light2) + 1.0) / 2.0;
  float glow2A = smoothstep(0.875, 1.0, d2);
  float glow2B = smoothstep(0.75, 1.0, d2) * 0.8;

  // dissolve
  float show1 = ease(min(time - 1.0, 6.0) / 6.0);
  float show2 = ease(clamp(time - 3.0, 0.0, 3.0) / 3.0);
  float dissolveA = cnoise3(
    vec3(
      vPosition.x * 0.06,
      (vPosition.y - vPosition.x * 0.5 + vPosition.z * 0.5) * 0.18,
      vPosition.z * 0.06
    ) + time * 0.02
  ) * 0.5 + 0.5;
  float dissolveB = cnoise3(
    vec3(
      vPosition.x * 0.4,
      (vPosition.y - vPosition.x * 0.5 + vPosition.z * 0.5) * .9,
      vPosition.z * 0.4
    )
  ) * 0.5 + 0.5;
  float dissolve1 = smoothstep(
    0.01 + show2 * 0.35 + dissolveEdge,
    0.015 + show2 * 0.35 + dissolveEdge,
    dissolveA * 0.8 + dissolveB * 0.2
  );
  float dissolve2 = smoothstep(
    0.0 + show2 * 0.35 + dissolveEdge,
    0.005 + show2 * 0.35 + dissolveEdge,
    dissolveA * 0.8 + dissolveB * 0.2
  );
  float dissolve3 = smoothstep(
    show1 - 0.05,
    show1 - 0.04,
    dissolveA * 0.8 + dissolveB * 0.2
  );
  float dissolve4 = smoothstep(
    show1 - 0.01,
    show1,
    dissolveA * 0.8 + dissolveB * 0.2
  );

  // define colors.
  float h = dissolveA * 0.2 - 0.02;
  vec3 hsv1 = vec3(
    h,
    (glow1A + glow2A) * 0.8 + 0.2,
    (glow1A + glow2A) * 0.25 + 0.05
  );
  vec3 rgb1 = convertHsvToRgb(hsv1);

  // define colors.
  vec3 hsv2 = vec3(
    h + (glow1B + glow2B) * 0.1 - 0.05,
    0.7,
    (glow1B + glow2B) * 0.7 + 0.22
  );
  vec3 rgb2 = convertHsvToRgb(hsv2);

  gl_FragColor = vec4(rgb1 * dissolve1 * (1.0 - dissolve3) * (1.0 - drawBrightOnly) + rgb2 * (1.0 - dissolve2) + rgb2 * dissolve3, 1.0 - dissolve4);
}
