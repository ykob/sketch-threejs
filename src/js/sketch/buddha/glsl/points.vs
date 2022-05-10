attribute vec3 position;
attribute float delay1;
attribute float delay2;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vColor;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

const float duration = 120.0;

void main() {
  // Loop animation
  float interval = mod(time + delay1, duration) / duration;
  vec3 move = vec3(
    cos(time * 0.5 + delay1) * 2.0,
    interval * 100.0,
    sin(time * 0.5 + delay2) * 2.0
    );

  // calculate gradation with position.y
  vec3 hsv = vec3(0.14, 0.65, 0.85);
  vec3 rgb = convertHsvToRgb(hsv);

  // calculate opacity.
  float fadeIn = smoothstep(0.0, 10.0, move.y);
  float blink = sin(time * 0.1 + delay2);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position + move, 1.0);
  float distanceFromCamera = 1000.0 / length(mvPosition.xyz);

  vColor = rgb;
  vOpacity = fadeIn * blink;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = distanceFromCamera;
}
