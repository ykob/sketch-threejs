attribute vec3 position;
attribute float colorH;
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

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  float thisTime = mod(time + i / size * interval, interval);

  vec3 updatePosition = position + vec3(0.0, pow(thisTime, 2.0) * -8.0, 0.0);
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(updatePosition, 1.0);

  vColor = convertHsvToRgb(vec3(colorH, 0.8, 0.6));
  vOpacity = smoothstep(interval * 0.05, interval * 0.2, thisTime)
    * (1.0 - smoothstep(interval * 0.2, interval * 0.9, thisTime));

  gl_PointSize = 6.0 * (1200.0 / length(mvPosition.xyz));
  gl_Position = projectionMatrix * mvPosition;
}
