precision highp float;

uniform vec3 cameraPosition;
uniform float time;
uniform float noiseRange;
uniform sampler2D texEgg1;
uniform sampler2D texEgg2;
uniform sampler2D texDiffSpace;

uniform float speed;
uniform float circleOutStepMin;
uniform float circleOutStepMax;
uniform float circleInStepMin;
uniform float circleInStepMax;
uniform float noisePosition;
uniform float noiseSize;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);
#pragma glslify: ease = require(glsl-easings/exponential-out);

void main() {
  float t1 = ease(min(time, 2.0) / 2.0);
  float t2 = (1.0 - ease(min(time, 2.0) / 2.0)) * 3.0;
  vec2 pos = vUv * 2.0 - vec2(1.0);

  float circleOut = smoothstep(circleOutStepMin, circleOutStepMax, t1 - length(pos));
  float circleIn = smoothstep(circleInStepMin, circleInStepMax, t1 * 0.5 - length(pos)) * 0.5;
  float circleLight = smoothstep(0.0, 0.1, (t1 - t2) * 0.3 - length(pos)) * smoothstep(0.0, 0.1, (t1 - t2) * 0.2 - length(pos + vec2(0.2, -0.2)));

  float noiseTime = time * speed + t2;
  float noise = (
    snoise3(
      vec3(pos * (noisePosition + noiseRange * 0.1) + vec2(sin(noiseTime),
      cos(noiseTime)),
      noiseTime + noiseRange * 100.0
      )
    ) + 1.0) / 2.0 * noiseSize;

  float mask = circleOut * noise + circleIn;
  float maskHighLight = circleLight * (noise + 0.12);
  float mask0 = 1.0 - step(maskHighLight, 0.13);
  float mask1 = (1.0 - step(mask, 0.6)) * step(maskHighLight, 0.13);
  float mask2 = (1.0 - step(mask, 0.28)) * step(mask, 0.6) * step(maskHighLight, 0.23);
  float mask3 = (1.0 - step(mask, 0.014)) * step(mask, 0.28);
  float mask4 = (1.0 - step(mask, 0.01)) * step(mask, 0.014);

  vec4 rgba0 = vec4(convertHsvToRgb(vec3(0.125, 0.2, 1.0)), 1.0) * mask0;
  vec4 rgba1 = vec4(convertHsvToRgb(vec3(0.125, 0.76, 1.0)), 1.0) * mask1;
  vec4 rgba2 = vec4(convertHsvToRgb(vec3(0.108, 0.91, 1.0)), 1.0) * mask2;
  vec4 rgba3 = vec4(convertHsvToRgb(vec3(0.1, 0.02, 0.99)), 1.0) * mask3;
  vec4 rgba4 = vec4(convertHsvToRgb(vec3(0.1, 0.2, 0.9)), 1.0) * mask4;

  float patternNoise1 = step(0.0, snoise3(vPosition * 0.015 + vec3(0.0, 0.0, time * 0.1))) * 0.05;
  float patternNoise2 = step(0.2, snoise3(vPosition * 0.025 + vec3(0.0, 1.0, time * 0.3))) * 0.03;
  vec4 patternColor = vec4(vec3(patternNoise1), 1.0) * mask1 + vec4(vec3(patternNoise2), 1.0) * mask2;

  vec4 eggColor = rgba0 + rgba1 + rgba2 + rgba3 + rgba4 + patternColor;

  gl_FragColor = eggColor;
}
