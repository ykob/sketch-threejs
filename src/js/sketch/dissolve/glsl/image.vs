attribute vec3 position;
attribute vec2 uv;

uniform vec2 resolution;
uniform vec2 imageResolution;

varying vec2 vUv;

void main(void) {
  vec2 ratio = vec2(
    min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
    min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
  );

  vec2 updateUv = vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  vUv = updateUv;
  gl_Position = vec4(position, 1.0);
}
