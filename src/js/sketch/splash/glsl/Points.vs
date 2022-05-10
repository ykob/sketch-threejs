attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform float alpha;
uniform float pixelRatio;
uniform sampler2D noiseTex;

varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  // Coordinate transformation
  float noiseR = texture2D(
    noiseTex,
    position.yz * 0.4 + vec2(time * 0.1, 0.0)
    ).r * 2.0 - 1.0;
  float noiseG = texture2D(
    noiseTex,
    position.zx * 0.4 + vec2(0.0, time * 0.1)
    ).g * 2.0 - 1.0;
  float noiseB = texture2D(
    noiseTex,
    position.xy * 0.4 - time * 0.1
    ).b * 2.0 - 1.0;
  vec3 noisePosition = vec3(noiseR, noiseG, noiseB) * (alpha * 0.6 + 0.6);
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position + noisePosition, 1.0);
  float distanceFromCamera = length(mvPosition.xyz);

  // Define the point size.
  float pointSize = pixelRatio * 240.0 / distanceFromCamera;

  vColor = convertHsvToRgb(
    vec3(
      (noiseR + noiseG + noiseB) * 0.2 + time * 0.1,
      0.8,
      0.4
      )
    );

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = pointSize;
}
