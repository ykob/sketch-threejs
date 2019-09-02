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
  float slide = texture2D(texNoise, vUv).b;

  float maskSlide = smoothstep(0.0, 0.2, t * 1.2 - (slide * 0.6 + noiseR * 0.2 + noiseG * 0.2));

  vec3 color1 = vec3(1.0, 0.0, 0.0) * (1.0 - maskSlide);
  vec3 color2 = vec3(0.0, 1.0, 0.0) * maskSlide;

  gl_FragColor = vec4(color1 + color2, 1.0);
}
