uniform vec2 resolution;
uniform sampler2D velocity;
uniform sampler2D acceleration;
uniform float time;
uniform vec2 vTouchMove;

varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: drag = require(glsl-force/drag)

void main(void) {
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 a = texture2D(acceleration, vUv).xyz;
  float noise = sqrt(length(v)) * 10.0;
  vec3 d = drag(a, 0.028);
  float fx = cnoise3(vec3(time * 0.1, v.y / noise, v.z / noise));
  float fy = cnoise3(vec3(v.x / noise, time * 0.1, v.z / noise));
  float fz = cnoise3(vec3(v.x / noise, v.y / noise, time * 0.1));
  vec3 f1 = vec3(fx, fy, fz) * 0.24;
  vec3 f2 = vec3(vTouchMove * 16.0 * (resolution / 640.0), 0.0);
  vec3 f3 = a + f1 + f2 + d;
  float vStep = 1.0 - step(1000.0, length(v + f3));
  gl_FragColor = vec4(f3 * vStep, 1.0);
}
