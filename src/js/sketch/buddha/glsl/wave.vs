attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

void main(void) {
  vec2 p = uv * 2.0 - 1.0;

  // wave motion.
  float force = pow(smoothstep(0.0, 0.5, length(p)) * (1.0 - smoothstep(0.5, 1.0, length(p))), 2.0) * 1.8;
  vec3 wave = vec3(0.0, 0.0, (sin(-time * 4.0 + length(p.xy) * 24.0) * 0.5 + 0.5) * force);

  // coordinate transformation
  vec3 updatePosition = position + wave;
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(updatePosition, 1.0);

  vPosition = updatePosition;
  vUv = uv;
  vOpacity = 1.0 - smoothstep(0.9, 1.0, length(p));

  gl_Position = projectionMatrix * mvPosition;
}
