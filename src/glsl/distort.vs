uniform float time;
uniform float radius;
uniform float distort;

varying vec3 vColor;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(./modules/hsv2rgb)

void main() {
  float updateTime = time / 1000.0;
  float noise = snoise3(vec3(position / 400.1 + updateTime * 5.0));
  vec4 mvPosition = modelViewMatrix * vec4(position * (noise * pow(distort, 2.0) + radius), 1.0);
  vec3 light = vec3(0.5);
  light += (dot(vec3(0.0, 1.0, 0.0), normal) + 1.0) / 2.0 * vec3(1.0) * 0.5;

  vColor = hsv2rgb(vec3(noise * distort * 0.3 + updateTime, 0.2, 1.0)) * light;

  gl_Position = projectionMatrix * mvPosition;
}
