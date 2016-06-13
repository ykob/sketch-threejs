varying float vAcceleration;
varying vec3 vColor;

uniform float time;

#pragma glslify: hsv2rgb = require(./modules/hsv2rgb)

void main(void) {
  gl_FragColor = vec4(hsv2rgb(vec3(vColor.x + time / 3600.0, vColor.y, vColor.z * vAcceleration)), 0.5);
}
