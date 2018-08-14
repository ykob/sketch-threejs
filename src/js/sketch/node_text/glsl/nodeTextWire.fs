precision highp float;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

void main() {
  gl_FragColor = vec4(vec3(1.0), vOpacity);
}
