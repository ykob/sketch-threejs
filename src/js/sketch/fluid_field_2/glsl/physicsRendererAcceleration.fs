precision highp float;

uniform float time;
uniform sampler2D velocity;
uniform sampler2D acceleration;
uniform sampler2D noiseTex;
uniform sampler2D delay;
uniform sampler2D mass;
uniform vec2 multiTime;

varying vec2 vUv;

#pragma glslify: drag = require(glsl-force/drag)

void main(void) {
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 a = texture2D(acceleration, vUv).xyz;
  float dl = texture2D(delay, vUv).x;
  float mass = texture2D(mass, vUv).x;
  vec3 d = drag(a, 0.01 + mass * 0.01);

  float texColorR = texture2D(noiseTex, (v.yz + v.x + time * multiTime * 14.0) * 0.01).r;
  float texColorG = texture2D(noiseTex, (v.zx + v.y + time * multiTime * 14.0) * 0.01).g;
  float texColorB = texture2D(noiseTex, (v.xy + v.z + time * multiTime * 14.0) * 0.01).b;
  vec3 noise = vec3(
    texColorR,
    texColorG * 2.0 - 1.0,
    texColorB * 2.0 - 1.0
  );
  vec3 f = noise * 0.008 * step(dl, time);

  float init = clamp(step(30.0, abs(v.x)) + step(30.0, abs(v.y)) + step(30.0, abs(v.z)), 0.0, 1.0);
  vec3 ff = (f + a + d) * (1.0 - init) + vec3(0.0) * init;

  gl_FragColor = vec4(ff, 1.0);
}
