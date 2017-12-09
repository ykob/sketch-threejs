attribute vec3 position;
attribute vec2 uv;
attribute vec3 instancePosition;
attribute float rotate;
attribute float delay;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vColor;
varying float vOpacity;

#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

const float duration = 2.4;

void main(void) {
  // calculate posiitons of instances.
  vec3 wavePosition = vec3(0.0, 0.0, sin(radians(position.y / 3.6) + time * 0.1 + delay * 9.0) * 40.0);
  vec3 updatePosition = position + instancePosition + wavePosition;
  mat4 rotateMat = computeRotateMat(radians(90.0), 0.0, radians(rotate));
  vec4 mvPosition = modelViewMatrix * rotateMat * vec4(updatePosition, 1.0);

  // calculate interval for uv animation and setting color.
  float now = mod(time + delay, duration) / duration;
  float noise = cnoise3(updatePosition / 100.0) * 0.5 + time * 0.1;
  vec3 hsv = vec3(noise, 0.4, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);
  float opacity = smoothstep(0.94, 1.0, mod(uv.y - now, 1.0));

  vColor = rgb;
  vOpacity = opacity;

  gl_Position = projectionMatrix * mvPosition;
}
