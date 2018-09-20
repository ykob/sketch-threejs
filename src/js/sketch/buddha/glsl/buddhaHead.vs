attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec3 vColor;

#pragma glslify: inverse = require(glsl-inverse);
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main(void) {
  // coordinate transformation
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position, 1.0);

  vec3 light = normalize(vec3(1.0, 1.0, 1.0));
  vec3 invLight = normalize(inverse(modelMatrix) * vec4(light, 0.0)).xyz;
  float d = dot(invLight, normal);
  float glow = smoothstep(0.8, 1.0, d) * 0.5;
  float shadow = d * 0.5;

  vec3 hsv = vec3(0.11, 0.9, 0.3 + shadow + glow);
  vec3 rgb = convertHsvToRgb(hsv);

  vColor = rgb;

  gl_Position = projectionMatrix * mvPosition;
}
