uniform float time;

varying vec3 vPosition;
varying vec3 vColor;
varying mat4 invertMatrix;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(./modules/hsv2rgb)
#pragma glslify: inverse = require(glsl-inverse);

void main() {
  float updateTime = time / 200.0;
  float noise = snoise3(vec3(position / 5.1 + updateTime * 0.5));

  vPosition = position + 0.6 * noise;
  vColor = hsv2rgb(vec3(updateTime, 0.4, 1.0));
  invertMatrix = inverse(modelMatrix);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + 0.6 * noise, 1.0);
}
