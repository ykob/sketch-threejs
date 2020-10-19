attribute vec3 position;
attribute vec3 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform vec2 resolution;
uniform float pixelRatio;
uniform sampler2D noiseTex;

void main() {
  // Coordinate transformation
  float texColorR = texture2D(noiseTex, uv.yz + time * 0.1).r * 3.0;
  float texColorG = texture2D(noiseTex, uv.zx + time * 0.1).g * 3.0;
  float texColorB = texture2D(noiseTex, uv.xy + time * 0.1).b * 3.0;
  vec3 noisePosition = vec3(texColorR, texColorG, texColorB);
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position + noisePosition, 1.0);
  float distanceFromCamera = length(mvPosition.xyz);

  // Define the point size.
  float pointSize = 10.0 * resolution.y / 1024.0 * pixelRatio * 50.0 / distanceFromCamera;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = pointSize;
}
