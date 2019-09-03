precision highp float;

uniform float time;
uniform float duration;
uniform vec2 imgRatio;
uniform sampler2D texNoise;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  float t = mod(time / duration, 1.0);

  vec2 updateUv = vUv * imgRatio + vec2(
    (1.0 - imgRatio.x) * 0.5,
    (1.0 - imgRatio.y) * 0.5
    );

  float noiseR = texture2D(texNoise, updateUv + vec2(time * 0.1, 0.0)).r;
  float noiseG = texture2D(texNoise, updateUv + vec2(time * 0.2, 0.0)).g;
  float slide = texture2D(texNoise, vUv * vec2(0.998) + 0.001).b;

  float mask = t * 1.08 - (slide * 0.6 + noiseR * 0.2 + noiseG * 0.2);
  float maskPrev = 1.0 - smoothstep(0.0, 0.04, mask);
  float maskNext = smoothstep(0.04, 0.08, mask);

  vec3 color1 = vec3(1.0, 0.0, 0.0) * maskPrev;
  vec3 color2 = vec3(0.0, 1.0, 0.0) * maskNext;

  gl_FragColor = vec4(color1 + color2, 1.0);
}
