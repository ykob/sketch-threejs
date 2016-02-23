uniform float time;
uniform float radius;
uniform float distort;

varying vec3 vColor;

uniform vec3 hemisphereLightDirection;
uniform vec3 hemisphereLightSkyColor;
uniform vec3 hemisphereLightGroundColor;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(./modules/hsv2rgb)

void main() {
  float updateTime = time / 1000.0;
  float noise = snoise3(vec3(position / 400.1 + (distort * 50.0) + updateTime * 5.0));
  vec4 mvPosition = modelViewMatrix * vec4(position * (noise * distort + radius), 1.0);
  vec3 light = vec3(0.8);
  light += dot(-hemisphereLightDirection, normal) * hemisphereLightSkyColor * 0.25;

  vColor = hsv2rgb(vec3(noise * 0.1 + updateTime, 0.5, 1.0)) * light;

  gl_Position = projectionMatrix * mvPosition;
}
