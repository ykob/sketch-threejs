attribute vec3 customColor;
attribute float vertexOpacity;
attribute float size;

varying vec3 vColor;
varying float fOpacity;

void main() {
  vColor = customColor;
  fOpacity = vertexOpacity;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (300.0 / length(mvPosition.xyz));
  gl_Position = projectionMatrix * mvPosition;
}
