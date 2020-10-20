precision highp float;

uniform float time;
uniform sampler2D velocity;
uniform sampler2D acceleration;
uniform sampler2D noiseTex;
uniform sampler2D delay;

varying vec2 vUv;

void main(void) {
  vec3 v = texture2D(velocity, vUv).xyz;
  vec3 a = texture2D(acceleration, vUv).xyz;
  float dl = texture2D(delay, vUv).x;

  float texColorR = texture2D(noiseTex, v.yz * 0.01 + vec2(v.x + time * 10.0) * 0.01).r;
  float texColorG = texture2D(noiseTex, v.zx * 0.01 + vec2(v.y + time * 10.0) * 0.01).g;
  float texColorB = texture2D(noiseTex, v.xy * 0.01 + vec2(v.z + time * 10.0) * 0.01).b;
  vec3 noise = vec3(texColorR, texColorG, texColorB) * 2.0 - 1.0;
  vec3 f = noise * 0.005 * step(dl, time);

  float init = clamp(step(20.0, abs(v.x)) + step(20.0, abs(v.y)) + step(20.0, abs(v.z)), 0.0, 1.0);
  vec3 ff = (a + f) * (1.0 - init) + vec3(0.0) * init;

  gl_FragColor = vec4(ff, 1.0);
}
