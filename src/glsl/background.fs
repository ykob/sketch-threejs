uniform float time;
uniform vec3 hemisphereLightDirection;
uniform vec3 hemisphereLightSkyColor;
uniform vec3 hemisphereLightGroundColor;

varying vec3 vPosition;
varying vec3 vColor;
varying mat4 invertMatrix;

void main() {
  vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
  vec3 inv_light = normalize(invertMatrix * vec4(hemisphereLightDirection, 1.0)).xyz;
  float diff = (dot(normal, inv_light) + 1.0) / 2.0;
  gl_FragColor = vec4(vColor * diff, 1.0);
}
