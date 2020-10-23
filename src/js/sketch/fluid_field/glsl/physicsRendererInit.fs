precision highp float;

uniform sampler2D initData;

varying vec2 vUv;

void main(void) {
  gl_FragColor = texture2D(initData, vUv);
}
