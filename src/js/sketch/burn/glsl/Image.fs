precision highp float;

uniform float time;
uniform vec2 imgRatio;
uniform sampler2D noiseTex;
uniform sampler2D imgPrevTex;
uniform sampler2D imgNextTex;

varying vec3 vPosition;
varying vec2 vUv;
varying float vTime;

void main() {
  vec2 updateUv = vUv * imgRatio + vec2(
    (1.0 - imgRatio.x) * 0.5,
    (1.0 - imgRatio.y) * 0.5
    );

  float noiseR = texture2D(noiseTex, updateUv + vec2(time * 0.1, 0.0)).r;
  float noiseG = texture2D(noiseTex, updateUv + vec2(time * 0.2, 0.0)).g;
  float slide = texture2D(noiseTex, vUv * vec2(0.998) + 0.001).b;

  float mask = vTime * 1.24 - (slide * 0.6 + noiseR * 0.2 + noiseG * 0.2);
  float maskPrev = 1.0 - smoothstep(0.12, 0.16, mask);
  float maskNext = smoothstep(0.16, 0.2, mask);
  float maskEdge = smoothstep(0.08, 0.14, mask) * (1.0 - smoothstep(0.18, 0.24, mask));

  vec4 imgPrev = texture2D(imgPrevTex, updateUv);
  vec4 imgNext = texture2D(imgNextTex, updateUv);

  vec3 color1 = imgPrev.rgb * maskPrev;
  vec3 color2 = imgNext.rgb * maskNext;
  vec3 color3 = vec3(0.0, 0.2, 1.0) * maskEdge;

  gl_FragColor = vec4(color1 + color2 - color3, 1.0);
}
