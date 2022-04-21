attribute vec3 position;
attribute float delay;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float force;

varying vec3 vColor;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

const float duration = 8.0;

void main() {
  // Loop animation
  float interval = mod(time + delay, duration) / duration;
  vec3 move = vec3(0.0, 0.0, (interval * 2.0 - 1.0) * 100.0);

  // calculate gradation with position.y
  vec3 hsv = vec3(0.3 + time * 0.1, 0.65 - force * 0.01, 0.85 + force * 0.01);
  vec3 rgb = convertHsvToRgb(hsv);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position + move, 1.0);
  float distanceFromCamera = 1000.0 / length(mvPosition.xyz);

  vColor = rgb;
  vOpacity = smoothstep(-100.0, 100.0, move.z);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = distanceFromCamera;
}
