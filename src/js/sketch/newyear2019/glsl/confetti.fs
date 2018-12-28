precision highp float;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;

void main() {
  // Flat Shading
  // vec3 light = normalize(vec3(-1.0, 1.0, -1.0));
  // vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  // float diff = (dot(normal, light) + 1.0) / 2.0;

  gl_FragColor = vec4(vColor, 1.0);
}
