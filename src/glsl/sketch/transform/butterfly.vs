attribute vec3 position;
attribute vec2 uv;
attribute vec3 spherePosition;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float index;
uniform float time;
uniform float size;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;
varying float vStep;

#pragma glslify: ease = require(glsl-easings/cubic-in-out);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);

void main() {
  float transformTimeBase = 1.0 - mod(time / 2.0, 1.0);
  float transformTime1 = ease(transformTimeBase);
  float transformTime2 = ease(1.0 - transformTimeBase);
  float transformTimeScale = transformTimeBase / 2.0;

  float flapTime = radians(sin(time * 4.0 - length(position.xy) / size * 2.0 + index * 2.0) * 45.0 + 30.0);
  vec3 position1 = vec3(
    cos(flapTime) * position.x,
    position.y,
    sin(flapTime) * abs(position.x)
  );

  float sphereNoise = cnoise3(spherePosition * 0.03 + time * 1.4);
  vec3 sphereNoisePosition = normalize(spherePosition) * sphereNoise * 30.0;
  vec3 position2 = spherePosition + sphereNoisePosition;

  vec3 updatePosition = position1 * transformTime1 + position2 * transformTime2;

  vPosition = position;
  vUv = uv;
  vOpacity = (1.0 - smoothstep(0.75, 1.0, abs((modelMatrix * vec4(updatePosition, 1.0)).z) / 900.0)) * 0.85;
  vStep = transformTime1;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(updatePosition, 1.0);
}
