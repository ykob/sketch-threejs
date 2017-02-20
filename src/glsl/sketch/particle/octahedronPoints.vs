attribute vec3 position;
attribute vec2 uvVelocity;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform sampler2D velocity;
uniform sampler2D acceleration;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

void main() {
  gl_PointSize = 1.0;
  //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * modelViewMatrix * texture2D(velocity, uvVelocity);
}
