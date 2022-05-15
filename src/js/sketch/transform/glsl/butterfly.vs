attribute vec3 position;
attribute vec2 uv;
attribute vec3 spherePosition;
attribute vec3 squarePosition;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float index;
uniform float time;
uniform float timeTransform;
uniform float interval;
uniform float size;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;
varying float vStep1;
varying float vStep2;
varying float vStep3;

#pragma glslify: ease = require(glsl-easings/exponential-in-out);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);

void main() {
  // Calcurate time of tranforming
  float t = timeTransform / interval;
  float transformTime1 = max((1.0 - t) * 2.0 - 1.0, 0.0);
  float transformTime2 = min((t) * 2.0, 1.0) * min((1.0 - t) * 2.0, 1.0);
  float transformTime3 = max((t) * 2.0 - 1.0, 0.0);

  // Position of Butterfly
  float flapTime = radians(sin(time * 4.0 - length(position.xy) / size * 2.0 + index * 2.0) * 45.0 + 30.0);
  vec3 flapPosition = vec3(
    cos(flapTime) * position.x,
    position.y + sin(time) * 10.0,
    sin(flapTime) * abs(position.x) + sin(time) * 10.0
  );
  mat4 flapRotateMat = calcRotateMat4(vec3(radians(45.0), 0.0, 0.0));
  vec3 position1 = (flapRotateMat * vec4(flapPosition, 1.0)).xyz;

  // Position of Sphere on transforming
  float sphereNoise = cnoise3(spherePosition * 0.02 + time * 2.4);
  vec3 sphereNoisePosition = normalize(spherePosition) * sphereNoise * 30.0;
  mat4 sphereRotateMat = calcRotateMat4(vec3(t * 4.0, 0.0, 0.0));
  vec3 position2 = (sphereRotateMat * vec4(spherePosition + sphereNoisePosition, 1.0)).xyz;

  // Position of Picture
  mat4 pictureRotateMat = calcRotateMat4(vec3(0.0, radians(45.0), 0.0));
  vec3 position3 = (pictureRotateMat * vec4(squarePosition, 1.0)).xyz;;

  // Total of All Position
  vec3 updatePosition = position1 * ease(transformTime1) + position2 * ease(transformTime2) + position3 * ease(transformTime3);

  // varying
  vPosition = updatePosition;
  vUv = uv;
  vStep1 = clamp((1.0 - t) * 6.0 - 2.0, 0.0, 1.0);
  vStep2 = clamp((t) * 6.0 - 1.0, 0.0, 1.0) * clamp((1.0 - t) * 6.0 - 1.0, 0.0, 1.0);
  vStep3 = clamp((t) * 6.0 - 3.0, 0.0, 1.0);

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(updatePosition, 1.0);
}
