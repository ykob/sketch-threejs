precision highp float;

uniform float time;
uniform float duration;
uniform vec2 imgRatio;
uniform sampler2D texNoise;

varying vec3 vPosition;
varying vec2 vUv;
varying float vTime;

void main() {
  vec2 updateUv = vUv * imgRatio + vec2(
    (1.0 - imgRatio.x) * 0.5,
    (1.0 - imgRatio.y) * 0.5
    );

  float noiseR = texture2D(texNoise, updateUv + vec2(time * 0.1, 0.0)).r;
  float noiseG = texture2D(texNoise, updateUv + vec2(time * 0.2, 0.0)).g;

  float opacity = smoothstep(1.0, 2.0, vPosition.z) * (1.0 - smoothstep(4.0, 14.0, vPosition.z));

  gl_FragColor = vec4(0.0, 0.0, 1.0, opacity * smoothstep(0.4, 0.6, noiseR));
}
