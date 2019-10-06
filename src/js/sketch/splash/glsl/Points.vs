attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform float alpha;
uniform float pixelRatio;
uniform sampler2D noiseTex;

varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  // Coordinate transformation
  float addUv = (0.25 + alpha * 0.2);
  vec4 noiseX = texture2D(
    noiseTex,
    position.yz * addUv + time * 0.1
    );
  vec4 noiseY = texture2D(
    noiseTex,
    position.zx * addUv - time * 0.1
    );
  vec4 noiseZ = texture2D(
    noiseTex,
    position.xy * addUv + time * 0.1
    );
  float addMove = (2.0 - alpha * 1.99);
  vec3 noisePosition = vec3(
    ((noiseX.r + noiseX.g + noiseX.b) - 1.5) * addMove,
    ((noiseY.r + noiseY.g + noiseY.b) - 1.5) * addMove,
    ((noiseZ.r + noiseZ.g + noiseZ.b) - 1.5) * addMove
    );
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position + noisePosition, 1.0);
  float distanceFromCamera = length(mvPosition.xyz);

  // Define the point size.
  float pointSize = pixelRatio * 400.0 / distanceFromCamera;

  vColor = convertHsvToRgb(
    vec3(
      (noiseX.r + noiseX.g + noiseX.b) * 0.3 + time * 0.1,
      0.8,
      0.4
      )
    );

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = pointSize;
}
