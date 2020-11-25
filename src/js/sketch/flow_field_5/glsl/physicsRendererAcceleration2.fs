precision highp float;

uniform float time;
uniform sampler2D prevVelocity;
uniform sampler2D velocity;
uniform sampler2D acceleration;
uniform sampler2D noiseTex;

varying vec2 vUv;

#pragma glslify: drag = require(glsl-force/drag)
#pragma glslify: hook = require(glsl-force/hook);

void main(void) {
  vec3 pv = texture2D(prevVelocity, vUv).xyz;
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 d = drag(a, 0.4);
  vec3 h = hook(v, pv, 1.0, 0.14);

  vec3 f = a + d + h;

  gl_FragColor = vec4(f, 1.0);
}
