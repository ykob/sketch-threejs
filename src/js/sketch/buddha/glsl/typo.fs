precision highp float;

uniform sampler2D texHannyaShingyo;

varying vec2 vUv;
varying float vOpacity;

void main() {
  vec4 texColor = texture2D(texHannyaShingyo, vUv);
  gl_FragColor = vec4(vec3(1.0), texColor.a * vOpacity);
}
