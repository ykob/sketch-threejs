attribute vec3 position;
attribute vec3 color;
attribute float i;
attribute float valid;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float interval;
uniform float time;

varying vec3 vColor;
varying float vOpacity;

void main() {
  float thisTime = mod(time + i / 200.0 * interval, interval);

  vec3 updatePosition = position + vec3(0.0, pow(thisTime, 2.0) * -6.0, 0.0);

  vColor = color;
  vOpacity = smoothstep(0.0, interval * 0.1, thisTime)
    * (1.0 - smoothstep(interval * 0.66, interval * 1.0, thisTime))
    * valid;

  gl_PointSize = 8.0;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(updatePosition, 1.0);
}
