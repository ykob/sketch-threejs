attribute vec3 position;
attribute float delay;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vColor;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

const float duration = 60.0;

void main() {
  // Loop animation
  float interval = mod(time + delay, duration) / duration;
  vec3 move = vec3(0.0, interval * 100.0, 0.0);

  // calculate gradation with position.y
  vec3 hsv = vec3(0.14, 0.65, 0.85);
  vec3 rgb = convertHsvToRgb(hsv);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position + move, 1.0);
  float distanceFromCamera = 1000.0 / length(mvPosition.xyz);

  vColor = rgb;
  vOpacity = smoothstep(-100.0, 100.0, move.z);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = distanceFromCamera;
}
