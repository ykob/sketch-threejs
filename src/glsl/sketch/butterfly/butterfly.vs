attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

void main() {
  vec3 updatePosition = vec3(
    position.x,
    position.y,
    position.z + sin(time * 10.0) * abs(position.x)
  );
  vec4 mvPosition = modelViewMatrix * vec4(updatePosition, 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
