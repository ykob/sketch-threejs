uniform vec2 resolution;
uniform sampler2D velocity;
uniform sampler2D acceleration;
uniform float time;

varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: drag = require(glsl-force/drag)

void main(void) {
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 d = drag(a, 0.8);
  float fx = cnoise3(vec3(time * 10.0, v.y / 100.0, v.z / 100.0));
  float fy = cnoise3(vec3(v.x / 100.0, time * 10.0, v.z / 100.0));
  gl_FragColor = vec4(a + d + vec3(fx, fy, 0.0), 1.0);
}
