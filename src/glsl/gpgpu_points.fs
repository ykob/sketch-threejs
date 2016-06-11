varying vec3 vColor;

#pragma glslify: hsv2rgb = require(./modules/hsv2rgb)

void main(void) {
  gl_FragColor = vec4(hsv2rgb(vColor), 0.5);
}
