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

  vec4 noiseRG = texture2D(texNoise, updateUv);
  float slide = texture2D(texNoise, vUv).b;

  float maskSlide = t * 2.0 - slide;

  vec3 color1 = vec3(1.0, 0.0, 0.0) * (1.0 - maskSlide);
  vec3 color2 = vec3(0.0, 1.0, 0.0) * maskSlide;

  gl_FragColor = vec4(color1 + color2, 1.0);
}
