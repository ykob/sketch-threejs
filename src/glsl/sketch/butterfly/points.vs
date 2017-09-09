attribute vec3 position;
attribute vec3 color;
attribute float i;
attribute float valid;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float size;
uniform float interval;
uniform float time;

varying vec3 vColor;
varying float vOpacity;

void main() {
  float thisTime = mod(time + i / size * interval, interval);

  vec3 updatePosition = position + vec3(0.0, pow(thisTime, 2.0) * -6.0, 0.0);
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(updatePosition, 1.0);

  vColor = color;
  vOpacity = smoothstep(interval * 0.05, interval * 0.2, thisTime)
    * (1.0 - smoothstep(interval * 0.2, interval * 0.9, thisTime))
    * 0.5;

  gl_PointSize = 4.0 * (1200.0 / length(mvPosition.xyz));
  gl_Position = projectionMatrix * mvPosition;
}
