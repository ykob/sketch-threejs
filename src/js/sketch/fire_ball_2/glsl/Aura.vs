attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float time;
uniform sampler2D noiseTex;
uniform vec3 acceleration;

varying vec2 vUv;

void main(void) {
  float noise1 = texture2D(noiseTex, uv * 0.25 + vec2(0.1, -0.1) * time).r;
  float noise2 = texture2D(noiseTex, uv * 0.25 + vec2(-0.1, -0.1) * time).g;
  float noise = (noise1 + noise2) * 0.5 * (1.0 - min(length(acceleration) / 5.0, 1.0));

  vec3 transformed = vec3(position + normalize(position) * smoothstep(0.2, 1.0, noise) * 12.0);

  vec4 mPosition = modelMatrix * vec4(transformed, 1.0);

  vUv = uv;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
