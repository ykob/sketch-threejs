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

void main() {
  float flapTime = radians(sin(time * 4.0 - length(position.xy) / size * 2.0 + index * 2.0) * 45.0 + 30.0);
  vec3 position1 = vec3(
    cos(flapTime) * position.x,
    position.y,
    sin(flapTime) * abs(position.x)
  );

  vec3 position2 = spherePosition; 

  float transformTime = (cos(time) + 1.0) / 2.0;

  vec3 updatePosition = position1 * transformTime + position2 * (1.0 - transformTime);

  vPosition = position;
  vUv = uv;
  vOpacity = (1.0 - smoothstep(0.75, 1.0, abs((modelMatrix * vec4(updatePosition, 1.0)).z) / 900.0)) * 0.85;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(updatePosition, 1.0);
}
