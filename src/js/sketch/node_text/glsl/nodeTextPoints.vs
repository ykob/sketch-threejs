attribute vec3 position;
attribute vec3 position2;
attribute float opacity;
attribute float opacity2;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float timeTransform;
uniform float durationTransform;
uniform float prevIndex;
uniform float nextIndex;

varying float vOpacity;

#pragma glslify: easeExpoOut = require(glsl-easings/exponential-out)
#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);

void main() {
  // transform
  vec3 prevPosition =
    position * (1.0 - step(1.0, prevIndex))
    + position2 * step(1.0, prevIndex) * (1.0 - step(2.0, prevIndex));
  vec3 nextPosition =
    position * (1.0 - step(1.0, nextIndex))
    + position2 * step(1.0, nextIndex) * (1.0 - step(2.0, nextIndex));
  float prevOpacity =
    opacity * (1.0 - step(1.0, prevIndex))
    + opacity2 * step(1.0, prevIndex) * (1.0 - step(2.0, prevIndex));
  float nextOpacity =
    opacity * (1.0 - step(1.0, nextIndex))
    + opacity2 * step(1.0, nextIndex) * (1.0 - step(2.0, nextIndex));
  float ease = easeExpoOut(min(timeTransform / 1.0, durationTransform) / durationTransform);
  vec3 mixPosition = mix(prevPosition, nextPosition, ease);
  float mixOpacity = mix(prevOpacity, nextOpacity, ease);

  // calculate shake moving.
  float now = time * 10.0 + length(mixPosition);
  mat4 rotateMat = calcRotateMat4(vec3(now));
  vec3 shake = (rotateMat * vec4(vec3(0.0, sin(now) * 5.0, 0.0), 1.0)).xyz;

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(mixPosition + shake, 1.0);

  vOpacity = mixOpacity;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 8.0;
}
