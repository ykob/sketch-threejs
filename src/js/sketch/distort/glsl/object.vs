uniform float time;
uniform float radius;
uniform float distort;

varying vec3 vColor;
varying vec3 vNormal;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: hsv2rgb = require(../../../old/glsl/hsv2rgb)

void main() {
  float updateTime = time / 1000.0;
  float noise = cnoise3(vec3(position / 200.1 + updateTime * 10.0));
  vec4 mvPosition = modelViewMatrix * vec4(position * (noise * pow(distort, 2.0) + radius), 1.0);

  vColor = hsv2rgb(vec3(noise * distort * 0.3 + updateTime, 0.2, 1.0));
  vNormal = normal;

  gl_Position = projectionMatrix * mvPosition;
}
