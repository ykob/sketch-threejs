precision highp float;

uniform float time;
uniform vec3 cameraPosition;

varying vec3 vPosition;
varying vec3 vColor;
varying mat4 vInvertMatrix;

const vec3 color = vec3(0.9);

void main() {
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  if(!gl_FrontFacing) {
      normal = -normal;
  }
  vec3 light = normalize(vInvertMatrix * vec4(vec3(-1000.0, 1000.0, -1000.0), 1.0)).xyz;
  float diff = (dot(normal, light) + 1.0) / 2.0 * 0.2 + 0.8;
  float opacity = (1.0 - (vPosition.z / 1000.0)) * 0.1 + 0.1;
  gl_FragColor = vec4(color * diff * vColor, opacity);
}
