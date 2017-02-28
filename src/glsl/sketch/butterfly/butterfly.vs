attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

void main() {
  float flapTime = radians(sin(time * 20.0) * 45.0);
  vec3 updatePosition = vec3(
    cos(flapTime) * position.x,
    position.y,
    sin(flapTime) * abs(position.x)
  );
  vec4 mvPosition = modelViewMatrix * vec4(updatePosition, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
