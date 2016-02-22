uniform float time;

varying vec3 vColor;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(./modules/hsv2rgb)

void main() {
  float updateTime = time / 1000.0;
  float noise = snoise3(vec3(position / 500.0 + updateTime * 4.0));
  vec4 mvPosition = modelViewMatrix * vec4(position * (noise * 0.3 + 1.0), 1.0);

  vColor = hsv2rgb(vec3(noise * 0.3 + updateTime, 0.5, 1.0));

  gl_Position = projectionMatrix * mvPosition;
}
