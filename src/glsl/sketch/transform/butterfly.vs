attribute vec3 position;
attribute vec2 uv;
attribute vec3 spherePosition;
attribute vec3 squarePosition;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float index;
uniform float time;
uniform float size;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;
varying float vStep1;
varying float vStep2;
varying float vStep3;

#pragma glslify: ease = require(glsl-easings/exponential-in-out);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);

void main() {
  float interval = mod(time / 1.5, 1.0);

  float transformTime1 = max((1.0 - interval) * 2.0 - 1.0, 0.0);
  float transformTime2 = min((interval) * 2.0, 1.0) * min((1.0 - interval) * 2.0, 1.0);
  float transformTime3 = max((interval) * 2.0 - 1.0, 0.0);

  float flapTime = radians(sin(time * 4.0 - length(position.xy) / size * 2.0 + index * 2.0) * 45.0 + 30.0);
  vec3 position1 = vec3(
    cos(flapTime) * position.x,
    position.y,
    sin(flapTime) * abs(position.x)
  );

  float sphereNoise = cnoise3(spherePosition * 0.02 + time * 2.4);
  vec3 sphereNoisePosition = normalize(spherePosition) * sphereNoise * 30.0;
  mat4 rotateMat = computeRotateMat(interval * 4.0, 0.0, 0.0);
  vec3 position2 = (rotateMat * vec4(spherePosition + sphereNoisePosition, 1.0)).xyz;

  vec3 position3 = squarePosition;

  vec3 updatePosition = position1 * ease(transformTime1) + position2 * ease(transformTime2) + position3 * ease(transformTime3);

  vPosition = updatePosition;
  vUv = uv;
  vStep1 = clamp((1.0 - interval) * 4.0 - 2.0, 0.0, 1.0);
  vStep2 = clamp((interval) * 4.0 - 1.0, 0.0, 1.0) * clamp((1.0 - interval) * 3.0 - 1.0, 0.0, 1.0);
  vStep3 = clamp((interval) * 3.0 - 1.0, 0.0, 1.0);

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(updatePosition, 1.0);
}
