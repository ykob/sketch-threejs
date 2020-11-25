precision highp float;

uniform float time;
uniform sampler2D velocity;
uniform sampler2D acceleration;
uniform sampler2D noiseTex;
uniform vec2 multiTime;
uniform vec3 anchor;
uniform sampler2D hookOptions;

varying vec2 vUv;

#pragma glslify: drag = require(glsl-force/drag)
#pragma glslify: hook = require(glsl-force/hook);

void main(void) {
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 a = texture2D(acceleration, vUv).xyz;
  vec3 hopt = texture2D(hookOptions, vUv).xyz;
  vec3 d = drag(a, hopt.r);
  vec3 h = hook(v, anchor, 50.0, hopt.g);

  float texColorR = texture2D(noiseTex, v.zy * 0.0025 + step(vUv.x, 0.333) * 0.333 + step(vUv.x, 0.666) * 0.333 + time * 0.04 + multiTime).r;
  float texColorG = texture2D(noiseTex, v.xz * 0.0025 + step(vUv.x, 0.333) * 0.333 + step(vUv.x, 0.666) * 0.333 - time * 0.04 + multiTime).g;
  float texColorB = texture2D(noiseTex, v.yx * 0.0025 + step(vUv.x, 0.333) * 0.333 + step(vUv.x, 0.666) * 0.333 + time * 0.04 - multiTime).b;
  vec3 noise = vec3(
    texColorR * 2.0 - 1.0,
    texColorG * 2.0 - 1.0,
    texColorB * 2.0 - 1.0
  );
  vec3 f = noise * 0.85;

  vec3 f2 = a + d + f + h;

  gl_FragColor = vec4(f2, 1.0);
}
