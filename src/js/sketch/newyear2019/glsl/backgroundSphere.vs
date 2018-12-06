attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main(void) {
  vec2 p = uv * 2.0 - 1.0;

  // calculate gradation
  vec3 hsv = vec3(
    p.y * 0.1 + 0.1,
    1.0,
    0.1
  );
  vec3 rgb = convertHsvToRgb(hsv);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vColor = rgb;

  gl_Position = projectionMatrix * mvPosition;
}
