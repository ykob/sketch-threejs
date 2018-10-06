attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;

varying vec3 vColor;
varying vec2 vUv;

#pragma glslify: inverse = require(glsl-inverse);
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main(void) {
  // calculate light and shadow.
  vec3 light = normalize(vec3(0.5, 0.5, 1.0));
  vec3 invLight = normalize(inverse(normalMatrix) * light);
  float d = dot(invLight, normal);
  float glow = smoothstep(0.85, 1.0, d);
  float shadow = d;

  // define colors.
  vec3 hsv = vec3(0.1, 0.0, 0.0 + (shadow + glow * 6.0) / 10.0);
  vec3 rgb = convertHsvToRgb(hsv);

  // coordinate transformation
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position, 1.0);

  vColor = rgb;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
