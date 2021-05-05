precision highp float;

uniform sampler2D tImage;

varying vec2 vUv;

void main() {
  vec3 tImageColor = texture2D(tImage, vUv).xyz;
  gl_FragColor = vec4(tImageColor, 1.0);
}
