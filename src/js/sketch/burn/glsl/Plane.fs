precision highp float;

uniform vec2 imgRatio;
uniform sampler2D texNoise;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec2 updateUv = vUv * imgRatio + vec2(
    (1.0 - imgRatio.x) * 0.5,
    (1.0 - imgRatio.y) * 0.5
    );

  vec4 noiseRG = texture2D(texNoise, updateUv);
  vec4 noiseB = texture2D(texNoise, vUv);

  gl_FragColor = vec4(noiseRG.rg, noiseB.b, 1.0);
}
