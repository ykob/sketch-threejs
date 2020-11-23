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
#pragma glslify: hook = require(glsl-force/hook);

void main(void) {
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 a = texture2D(acceleration, vUv).xyz;
  float dl = texture2D(delay, vUv).x;
  float mass = texture2D(mass, vUv).x;
  vec3 d = drag(a, 0.01);
  vec3 h = hook(v, vec3(0.0), 50.0, 0.0055);

  float texColorR = texture2D(noiseTex, (v.zy + vec2(sin(v.x * 0.1), 0.0)) * 0.0026 + time * 0.06 + multiTime).r;
  float texColorG = texture2D(noiseTex, (v.xz + vec2(sin(v.y * 0.1), 0.0)) * 0.0026 - time * 0.06 + multiTime).g;
  float texColorB = texture2D(noiseTex, (v.yx + vec2(sin(v.z * 0.1), 0.0)) * 0.0026 + time * 0.06 + multiTime).b;
  vec3 noise = vec3(
    texColorR * 2.0 - 1.0,
    texColorG * 2.0 - 1.0,
    texColorB * 2.0 - 1.0
  );
  vec3 f = noise * 0.09;

  vec3 f2 = a + d + f + h;

  gl_FragColor = vec4(f2, 1.0);
}
