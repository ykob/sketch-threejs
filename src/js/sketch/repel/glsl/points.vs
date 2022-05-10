attribute vec3 position;
attribute vec2 uv;

uniform vec3 mouse;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position, 1.0);
  vec3 subPosition = mouse - mPosition.xyz;
  float force = (1000.0 - clamp(length(subPosition), 0.0, 1000.0)) / 4.0;
  mPosition = vec4(mPosition.xyz + force * normalize(-subPosition), 1.0);

  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
  gl_PointSize = 3.0;
}
