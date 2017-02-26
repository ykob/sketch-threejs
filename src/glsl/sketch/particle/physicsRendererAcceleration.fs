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
  vec3 d = drag(a, 0.02);
  float fx = cnoise3(vec3(time * 0.1, v.y / 500.0, v.z / 500.0));
  float fy = cnoise3(vec3(v.x / 500.0, time * 0.1, v.z / 500.0));
  float fz = cnoise3(vec3(v.x / 500.0, v.y / 500.0, time * 0.1));
  vec3 f1 = vec3(fx, fy, fz) * 0.12;
  vec3 f2 = vec3(vTouchMove * 10.0 * (resolution / 640.0), 0.0);
  gl_FragColor = vec4(a + f1 + f2 + d, 1.0);
}
