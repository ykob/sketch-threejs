precision highp float;

uniform float time;
uniform sampler2D outlineTex;
uniform sampler2D noiseTex;

varying vec3 vPosition;
varying vec2 vUv;

const float blurIteration = 12.0;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  // calculate blur mask.
  vec4 destColor = vec4(0.0);
  for (float i = 0.0; i < blurIteration; i++) {
    for (float j = 0.0; j < blurIteration; j++) {
      vec2 p = (vec2(i, j) / blurIteration * 2.0 - 1.0) / 512.0 * 60.0;
      destColor += texture2D(outlineTex, vUv + p) / pow(blurIteration, 2.0);
    }
  }

  float noise1 = texture2D(noiseTex, vUv - vec2(0.0, time * 0.2)).r;
  float noise2 = texture2D(noiseTex, vUv * 2.0 - vec2(0.0, time * 0.4)).g;
  float noise3 = texture2D(noiseTex, vUv * 3.0 - vec2(0.0, time * 0.8)).b;
  float noise = noise1 * 0.65 + noise2 * 0.3 + noise3 * 0.05;

  float mask = pow(destColor.r + (noise * 0.5 - 0.5), 3.0) * 50.0;

  vec3 hsv = vec3(0.88 + mask * 0.08, 0.8 - mask * 0.2, 0.5 + mask * 0.5);

  gl_FragColor = vec4(convertHsvToRgb(hsv), mask);
}
