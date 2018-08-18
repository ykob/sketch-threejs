attribute vec3 position;
attribute vec2 uv;

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
  float hovering = cos(time * 2.0 + index * 3.0) * size / 16.0;
  vec3 updatePosition = vec3(
    cos(flapTime) * position.x,
    position.y + hovering,
    sin(flapTime) * abs(position.x) + hovering
  );

  vPosition = position;
  vUv = uv;
  vOpacity = (1.0 - smoothstep(0.75, 1.0, abs((modelMatrix * vec4(updatePosition, 1.0)).z) / 900.0)) * 0.85;

  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(updatePosition, 1.0);
}
