precision highp float;

uniform float time;
uniform sampler2D velocity;
uniform sampler2D acceleration;
uniform sampler2D accelerationFirst;
uniform sampler2D noiseTex;
uniform sampler2D delay;
uniform sampler2D mass;
uniform vec2 multiTime;

varying vec2 vUv;

#pragma glslify: drag = require(glsl-force/drag)

void main(void) {
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 af = texture2D(accelerationFirst, vUv).xyz;
  float dl = texture2D(delay, vUv).x;
  float mass = texture2D(mass, vUv).x;
  vec3 d = drag(a, 0.032 + mass * 0.006);

  float texColorR = texture2D(noiseTex, (v.yz + vec2(sin(v.x * 0.1), 0.0) + time * multiTime * 12.0) * 0.002).r;
  float texColorG = texture2D(noiseTex, (v.zx + vec2(sin(v.y * 0.1), 0.0) + time * multiTime * 12.0) * 0.002).g;
  float texColorB = texture2D(noiseTex, (v.xy + vec2(sin(v.z * 0.1), 0.0) + time * multiTime * 12.0) * 0.002).b;
  vec3 noise = vec3(
    texColorR,
    texColorG * 2.0 - 1.0,
    texColorB * 2.0 - 1.0
  );
  vec3 f = noise * 0.2;

  float init = clamp(step(500.0, v.x), 0.0, 1.0);
  vec3 f2 = (a + (f + d) * step(dl, time)) * (1.0 - init) + af * init;

  gl_FragColor = vec4(f2, 1.0);
}
