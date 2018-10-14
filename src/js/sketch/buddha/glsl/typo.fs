precision highp float;

uniform sampler2D texHannyaShingyo;

varying vec3 vPositionNoise;
varying vec2 vUv;
varying vec2 vUvBase;
varying float vOpacity;
varying float vStep;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  // coordinate tex color.
  vec4 texColor = texture2D(texHannyaShingyo, vUv);

  // coordinate cross fade alpha value with delay.
  float dRange = 0.1;
  float crossFadeDelay = vUvBase.y * dRange;
  float crossFade = smoothstep(crossFadeDelay, crossFadeDelay + 0.3, vStep)
    * (1.0 - smoothstep(crossFadeDelay + 0.7 - dRange, crossFadeDelay + 1.0 - dRange, vStep));

  float noise1 = cnoise3(vec3(vPositionNoise * 0.7));
  float noise2 = cnoise3(vec3(vPositionNoise * 1.8));
  float noiseAll = (noise1 * 2.0 + noise2 * 0.4) / 2.4;
  float noise = (noiseAll * 0.5 + 0.5) + (crossFade * 2.0 - 1.0);
  float disolveMask = smoothstep(0.28, 0.3, noise);
  vec4 disolve = vec4(convertHsvToRgb(vec3(0.13, 0.9, 0.75)), 1.0) * disolveMask;
  float disolveEdgeMask = smoothstep(0.0, 0.02, noise) * (1.0 - smoothstep(0.28, 0.3, noise));
  vec4 disolveEdge = vec4(convertHsvToRgb(vec3(0.13, 0.4, 1.0)), 1.0) * disolveEdgeMask;

  gl_FragColor = (disolve + disolveEdge) * vOpacity * texColor.a;
}
