precision highp float;

uniform vec2 resolution;
uniform vec2 direction;
uniform float radius;
uniform sampler2D texture;

varying vec2 vUv;

vec4 gaussianBlur(sampler2D texture, vec2 uv, float radius, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 step = radius / resolution * direction;
  color += texture2D(texture, uv + -30.0 * step) * 0.000044463576696752694;
  color += texture2D(texture, uv + -29.0 * step) * 0.00007045416494915056;
  color += texture2D(texture, uv + -28.0 * step) * 0.0001099096126906708;
  color += texture2D(texture, uv + -27.0 * step) * 0.00016880723998699519;
  color += texture2D(texture, uv + -26.0 * step) * 0.00025525396029412817;
  color += texture2D(texture, uv + -25.0 * step) * 0.0003799964739478872;
  color += texture2D(texture, uv + -24.0 * step) * 0.0005569445069582366;
  color += texture2D(texture, uv + -23.0 * step) * 0.0008036541345232365;
  color += texture2D(texture, uv + -22.0 * step) * 0.0011416972770451463;
  color += texture2D(texture, uv + -21.0 * step) * 0.001596823459247415;
  color += texture2D(texture, uv + -20.0 * step) * 0.002198804676697693;
  color += texture2D(texture, uv + -19.0 * step) * 0.0029808483791945177;
  color += texture2D(texture, uv + -18.0 * step) * 0.003978472126807061;
  color += texture2D(texture, uv + -17.0 * step) * 0.005227760816555183;
  color += texture2D(texture, uv + -16.0 * step) * 0.006762976274064666;
  color += texture2D(texture, uv + -15.0 * step) * 0.008613559380852844;
  color += texture2D(texture, uv + -14.0 * step) * 0.010800652851120281;
  color += texture2D(texture, uv + -13.0 * step) * 0.013333369986564198;
  color += texture2D(texture, uv + -12.0 * step) * 0.016205128746770582;
  color += texture2D(texture, uv + -11.0 * step) * 0.01939044575559005;
  color += texture2D(texture, uv + -10.0 * step) * 0.022842624955526088;
  color += texture2D(texture, uv + -9.0 * step) * 0.02649276597348318;
  color += texture2D(texture, uv + -8.0 * step) * 0.030250448423666733;
  color += texture2D(texture, uv + -7.0 * step) * 0.03400631888443281;
  color += texture2D(texture, uv + -6.0 * step) * 0.037636625557126956;
  color += texture2D(texture, uv + -5.0 * step) * 0.0410095302098648;
  color += texture2D(texture, uv + -4.0 * step) * 0.04399280495100364;
  color += texture2D(texture, uv + -3.0 * step) * 0.04646232452009806;
  color += texture2D(texture, uv + -2.0 * step) * 0.048310624731385546;
  color += texture2D(texture, uv + -1.0 * step) * 0.04945474015528432;
  color += texture2D(texture, uv + 0.0 * step) * 0.049842336475142184;
  color += texture2D(texture, uv + 1.0 * step) * 0.04945474015528432;
  color += texture2D(texture, uv + 2.0 * step) * 0.048310624731385546;
  color += texture2D(texture, uv + 3.0 * step) * 0.04646232452009806;
  color += texture2D(texture, uv + 4.0 * step) * 0.04399280495100364;
  color += texture2D(texture, uv + 5.0 * step) * 0.0410095302098648;
  color += texture2D(texture, uv + 6.0 * step) * 0.037636625557126956;
  color += texture2D(texture, uv + 7.0 * step) * 0.03400631888443281;
  color += texture2D(texture, uv + 8.0 * step) * 0.030250448423666733;
  color += texture2D(texture, uv + 9.0 * step) * 0.02649276597348318;
  color += texture2D(texture, uv + 10.0 * step) * 0.022842624955526088;
  color += texture2D(texture, uv + 11.0 * step) * 0.01939044575559005;
  color += texture2D(texture, uv + 12.0 * step) * 0.016205128746770582;
  color += texture2D(texture, uv + 13.0 * step) * 0.013333369986564198;
  color += texture2D(texture, uv + 14.0 * step) * 0.010800652851120281;
  color += texture2D(texture, uv + 15.0 * step) * 0.008613559380852844;
  color += texture2D(texture, uv + 16.0 * step) * 0.006762976274064666;
  color += texture2D(texture, uv + 17.0 * step) * 0.005227760816555183;
  color += texture2D(texture, uv + 18.0 * step) * 0.003978472126807061;
  color += texture2D(texture, uv + 19.0 * step) * 0.0029808483791945177;
  color += texture2D(texture, uv + 20.0 * step) * 0.002198804676697693;
  color += texture2D(texture, uv + 21.0 * step) * 0.001596823459247415;
  color += texture2D(texture, uv + 22.0 * step) * 0.0011416972770451463;
  color += texture2D(texture, uv + 23.0 * step) * 0.0008036541345232365;
  color += texture2D(texture, uv + 24.0 * step) * 0.0005569445069582366;
  color += texture2D(texture, uv + 25.0 * step) * 0.0003799964739478872;
  color += texture2D(texture, uv + 26.0 * step) * 0.00025525396029412817;
  color += texture2D(texture, uv + 27.0 * step) * 0.00016880723998699519;
  color += texture2D(texture, uv + 28.0 * step) * 0.0001099096126906708;
  color += texture2D(texture, uv + 29.0 * step) * 0.00007045416494915056;
  color += texture2D(texture, uv + 30.0 * step) * 0.000044463576696752694;
  return color;
}

void main() {
  vec4 color = gaussianBlur(texture, vUv, radius, resolution, direction);
  gl_FragColor = color;
}
