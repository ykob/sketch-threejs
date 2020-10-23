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
  float texColorR = texture2D(noiseTex, (v.yz + vec2(v.x) + vec2(time, time * 0.66) * 14.0) * 0.007).r;
  float texColorG = texture2D(noiseTex, (v.zx + vec2(v.y) + vec2(time, time * 0.66) * 14.0) * 0.007).g;
  float texColorB = texture2D(noiseTex, (v.xy + vec2(v.z) + vec2(time, time * 0.66) * 14.0) * 0.007).b;
  vec3 noise = vec3(texColorR, texColorG, texColorB) * 2.0 - 1.0;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position + noise * movable * 2.0, 1.0);
  float distanceFromCamera = length(mvPosition.xyz);

  vColor = vec3(texColorR, texColorG, texColorB);

  gl_Position = projectionMatrix * mvPosition;
}
