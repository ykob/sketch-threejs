uniform float side;
uniform sampler2D velocityInit;
uniform sampler2D velocity;
uniform sampler2D acceleration;
uniform float time;

varying vec2 vUv;

#pragma glslify: polar = require(glsl-util/polar)

void main(void) {
  vec3 v = texture2D(acceleration, vUv).xyz + texture2D(velocity, vUv).xyz;
  float vStep = step(1000.0, length(v));
  gl_FragColor = vec4(
    v * (1.0 - vStep) + texture2D(velocityInit, vUv).xyz * vStep,
    1.0
  );
}
