attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform vec2 resolution;
uniform float pixelRatio;
uniform sampler2D noiseTex;
uniform vec2 multiTime;

varying vec3 vColor;

void main() {
  // Coordinate transformation
  vec3 v = position;
  float texColorR = texture2D(noiseTex, (v.yz + v.x + time * multiTime * 14.0) * 0.01).r;
  float texColorG = texture2D(noiseTex, (v.zx + v.y + time * multiTime * 14.0) * 0.01).g;
  float texColorB = texture2D(noiseTex, (v.xy + v.z + time * multiTime * 14.0) * 0.01).b;
  vec3 noise = vec3(
    texColorR,
    texColorG * 2.0 - 1.0,
    texColorB * 2.0 - 1.0
  );
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position + noise * 2.0, 1.0);
  float distanceFromCamera = length(mvPosition.xyz);

  // Define the point size.
  float pointSize = 3.0 * resolution.y / 1024.0 * pixelRatio * 50.0 / distanceFromCamera;

  vColor = vec3(texColorR, texColorG, texColorB);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = pointSize;
}
