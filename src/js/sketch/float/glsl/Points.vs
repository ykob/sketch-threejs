attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform float alpha;
uniform float pixelRatio;
uniform sampler2D noiseTex;

void main() {
  // Coordinate transformation
  float addUv = (0.2 + alpha * 0.2);
  vec4 noiseX = texture2D(
    noiseTex,
    position.yz * addUv + time * 0.01
    );
  vec4 noiseY = texture2D(
    noiseTex,
    position.zx * addUv + time * 0.01
    );
  vec4 noiseZ = texture2D(
    noiseTex,
    position.xy * addUv + time * 0.01
    );
  float addMove = (1.0 - alpha * 0.7);
  vec3 noisePosition = vec3(
    ((noiseX.r + noiseX.g + noiseX.b) * 2.0 - 3.0) * addMove,
    ((noiseY.r + noiseY.g + noiseY.b) * 2.0 - 3.0) * addMove,
    ((noiseZ.r + noiseZ.g + noiseZ.b) * 2.0 - 3.0) * addMove
    );
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position + noisePosition, 1.0);
  float distanceFromCamera = length(mvPosition.xyz);

  // Define the point size.
  float pointSize = pixelRatio * 100.0 / distanceFromCamera;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = pointSize;
}
