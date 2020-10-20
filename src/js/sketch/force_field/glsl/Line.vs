attribute vec3 position;
attribute vec3 uv;
attribute float movable;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform vec2 resolution;
uniform float pixelRatio;
uniform sampler2D noiseTex;

varying vec3 vColor;

void main() {
  // Coordinate transformation
  vec3 v = position;
  float texColorR = texture2D(noiseTex, v.yz * 0.01 + vec2(v.x + time * 10.0) * 0.01).r;
  float texColorG = texture2D(noiseTex, v.zx * 0.01 + vec2(v.y + time * 10.0) * 0.01).g;
  float texColorB = texture2D(noiseTex, v.xy * 0.01 + vec2(v.z + time * 10.0) * 0.01).b;
  vec3 noise = vec3(texColorR, texColorG, texColorB) * 2.0 - 1.0;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position + noise * movable * 2.0, 1.0);
  float distanceFromCamera = length(mvPosition.xyz);

  vColor = vec3(texColorR, texColorG, texColorB);

  gl_Position = projectionMatrix * mvPosition;
}
