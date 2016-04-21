uniform float time;
uniform float acceleration;

varying vec3 vPosition;
varying vec3 vColor;
varying mat4 invertMatrix;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(./modules/hsv2rgb)
#pragma glslify: inverse = require(glsl-inverse);
#pragma glslify: rotate = require(./modules/raymarching/rotate)

vec3 getRotate(vec3 p) {
  return rotate(p, radians(time / 6.0), radians(time / 7.0), radians(time / 8.0));
}

void main() {
  float updateTime = time / 400.0;
  float noise = snoise3(vec3(position / 5.1 + updateTime * 0.5));
  vec3 update_position = getRotate(position + 0.8 * noise);

  vPosition = update_position;
  vColor = hsv2rgb(vec3(updateTime + position.y / 400.0, 0.4, 1.0));
  invertMatrix = inverse(modelMatrix);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(update_position, 1.0);
}
