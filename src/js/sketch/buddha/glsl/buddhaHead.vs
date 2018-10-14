attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

void main(void) {
  //
  float noise = cnoise3(position * 0.8 + time * 0.4) * (sin(position.y - time * 0.8) * 1.4 + sin(position.y - time * 2.0) * 0.6) / 2.0;
  vec3 noisePosition = normalize(position * vec3(1.0, 0.0, 1.0)) * pow(noise, 2.0) * 0.8;

  // coordinate transformation
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position + noisePosition, 1.0);

  vPosition = (modelMatrix * vec4(position + noisePosition, 0.0)).xyz;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
