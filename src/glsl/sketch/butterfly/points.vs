attribute vec3 position;
attribute vec3 color;
attribute float time;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float interval;

varying vec3 vColor;
varying float vOpacity;

void main() {
  vec3 updatePosition = position + vec3(0.0, pow(time, 2.0) * -10.0, 0.0);

  vColor = color;
  vOpacity = 1.0 - time / interval;

  gl_PointSize = 8.0;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(updatePosition, 1.0);
}
