precision highp float;

uniform sampler2D texNoise;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec4 noise = texture2D(texNoise, vUv);

  gl_FragColor = noise;
}
