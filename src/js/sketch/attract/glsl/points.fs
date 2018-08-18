varying float vAcceleration;
varying vec3 vColor;
varying float vOpacity;

uniform float time;

#pragma glslify: hsv2rgb = require(../../../old/glsl/hsv2rgb)

void main(void) {
  vec3 n;
  n.xy = gl_PointCoord * 2.0 - 1.0;
  n.z = 1.0 - dot(n.xy, n.xy);
  if (n.z < 0.0) discard;
  gl_FragColor = vec4(hsv2rgb(vec3(vColor.x + time / 3600.0, vColor.y, vColor.z)), vOpacity);
}
