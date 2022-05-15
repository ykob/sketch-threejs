attribute vec3 position;
attribute vec2 uv;
attribute vec3 instancePosition;
attribute float rotate;
attribute float delay;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vDelay;
varying vec3 vColor;

#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb)

void main(void) {
  // calculate posiitons of instances.
  vec3 wavePosition = vec3(0.0, 0.0, sin(radians(position.y / 3.6) + time * 0.1 + delay * 9.0) * 50.0);
  vec3 updatePosition = position + instancePosition + wavePosition;
  mat4 rotateMat = calcRotateMat4(vec3(radians(90.0), 0.0, radians(rotate)));
  vec4 mvPosition = modelViewMatrix * rotateMat * vec4(updatePosition, 1.0);

  // calculate interval for uv animation and setting color.
  float noise = cnoise3(updatePosition / 100.0) * 0.5 + time * 0.1;
  vec3 hsv = vec3(noise, 0.45, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);

  vPosition = position;
  vUv = uv;
  vDelay = delay;
  vColor = rgb;

  gl_Position = projectionMatrix * mvPosition;
}
