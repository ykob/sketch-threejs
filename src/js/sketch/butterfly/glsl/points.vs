attribute vec3 position;
attribute float colorH;
attribute float i;
attribute float valid;

uniform vec3 cameraPosition;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float size;
uniform float interval;
uniform float time;

varying vec3 vColor;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  float thisTime = mod(time + i / size * interval, interval);

  vec3 updatePosition = position + vec3(
    cos(thisTime * 3.0 + i) * 3.0,
    thisTime * -16.0,
    sin(thisTime * 3.0 + i) * 3.0
  );
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(updatePosition, 1.0);

  vec3 hsv = vec3(colorH + sin(i) * 0.075, 0.8, 1.0);

  vColor = convertHsvToRgb(hsv);
  vOpacity = smoothstep(interval * 0.0, interval * 0.1, thisTime)
    * (1.0 - smoothstep(interval * 0.2, interval * 0.9, thisTime));

  gl_PointSize = 12000.0 / length(mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
