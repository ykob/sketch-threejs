uniform float time;
uniform float acceleration;

varying vec3 vPosition;
varying vec3 vColor;
varying mat4 invertMatrix;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(../../../old/glsl/hsv2rgb)
#pragma glslify: inverse = require(glsl-inverse);
#pragma glslify: rotate = require(../../../old/glsl/raymarching/rotate)

vec3 getRotate(vec3 p) {
  return rotate(p, radians(time / 6.0), radians(time / 7.0), radians(time / 8.0));
}

void main() {
  float updateTime = time / 400.0;
  vec3 p_rotate = getRotate(position);
  float noise = snoise3(vec3(p_rotate / 12.1 + updateTime * 0.5));
  vec3 p_noise = p_rotate + p_rotate * noise / 20.0 * (min(acceleration, 6.0) + 1.0);

  vPosition = p_noise;
  vColor = hsv2rgb(vec3(updateTime + position.y / 400.0, 0.05 + min(acceleration / 10.0, 0.25), 1.0));
  invertMatrix = inverse(modelMatrix);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p_noise, 1.0);
}
