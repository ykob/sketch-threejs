attribute vec3 position;
attribute vec2 uv;
attribute vec3 instancePosition;
attribute float delay;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;
varying float vOpacity;

const float duration = 200.0;

#pragma glslify: calcRotateMat4Z = require(glsl-matrix/calcRotateMat4Z);
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main(void) {
  float now = mod(time + delay * duration, duration) / duration;

  mat4 rotateMat = calcRotateMat4Z(radians(delay * 360.0) + time * 0.1);
  vec3 rotatePosition = (rotateMat * vec4(position, 1.0)).xyz;

  vec3 moveRise = vec3(
    (now * 2.0 - 1.0) * (2500.0 - (delay * 2.0 - 1.0) * 300.0),
    (now * 2.0 - 1.0) * 2000.0,
    sin(radians(time * 0.1 + delay)) * 200.0
    );
  vec3 updatePosition = instancePosition + moveRise + rotatePosition;

  vec3 hsv = vec3(time * 0.1 + delay * 0.1 + length(instancePosition), 0.32 , 0.9);
  vec3 rgb = convertHsvToRgb(hsv);
  float opacity = smoothstep(0.0, 0.3, now) * (1.0 - smoothstep(0.7, 1.0, now));

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(updatePosition, 1.0);

  vPosition = position;
  vUv = uv;
  vColor = rgb;
  vOpacity = opacity;

  gl_Position = projectionMatrix * mvPosition;
}
