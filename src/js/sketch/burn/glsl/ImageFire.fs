precision highp float;

uniform float time;
uniform float duration;
uniform vec2 imgRatio;
uniform sampler2D noiseTex;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;
varying float vTime;

void main() {
  vec2 updateUv = vUv * imgRatio + vec2(
    (1.0 - imgRatio.x) * 0.5,
    (1.0 - imgRatio.y) * 0.5
    );

  float noiseR = texture2D(noiseTex, updateUv + vec2(time * 0.1, 0.0)).r;
  float noiseG = texture2D(noiseTex, updateUv + vec2(time * 0.2, 0.0)).g;

  gl_FragColor = vec4(1.0, 0.38, 0.0, vOpacity * smoothstep(0.4, 0.6, noiseR));
}
