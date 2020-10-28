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
  vec3 d = drag(a, 0.025 + mass * 0.01);

  float texColorR = texture2D(noiseTex, (v.yz + v.x + time * multiTime * 10.0) * 0.008).r;
  float texColorG = texture2D(noiseTex, (v.zx + v.y + time * multiTime * 10.0) * 0.008).g;
  float texColorB = texture2D(noiseTex, (v.xy + v.z + time * multiTime * 10.0) * 0.008).b;
  vec3 noise = vec3(
    texColorR * 2.0 - 1.0,
    texColorG * 2.0 - 1.0,
    texColorB * 2.0 - 1.0
  );
  vec3 f = noise * 0.03 * step(dl, time);

  float init = step(60.0, length(v));
  vec3 f2 = (f + a + d) * ((1.0 - init) + vec3(0.0) * init);

  gl_FragColor = vec4(f2, 1.0);
}
