precision highp float;

uniform float time;
uniform sampler2D texture;
uniform vec2 resolution;

varying vec2 vUv;

const float godrayIteration = 60.0;
const float godrayStrength = 20.0;

float random2(vec2 c){
  return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
float randomNoise(vec2 p) {
  return (random2(p - vec2(sin(time))) * 2.0 - 1.0) * 0.04;
}

void main() {
  // Convert uv to the other vec2 has a range from -1.0 to 1.0.
  vec2 p = vUv * 2.0 - 1.0;
  vec2 ratio = 1.0 / resolution;

  // Random Noise
  float rNoise = randomNoise(vUv);

  // RGB Shift
  float texColorR = texture2D(texture, vUv - vec2((2.0 * abs(p.x) + 1.0) * ratio.x, 0.0)).r;
  float texColorG = texture2D(texture, vUv + vec2((2.0 * abs(p.x) + 1.0) * ratio.x, 0.0)).g;
  float texColorB = texture2D(texture, vUv).b;

  // godray
  vec2 godrayCenter = vec2(0.5);
  vec3 godrayDestColor = vec3(0.0);
  float godrayTotalWeight = 0.0;

  for (float i = 0.0; i < 60.0; i++) {
    float alpha = i / godrayIteration; // step in loop [0, 1].
    float weight = alpha - alpha * alpha; // conic curve [0, 0.25, 0].
    vec2 shiftUv = vUv - (vUv - godrayCenter) * alpha * godrayStrength / godrayIteration; // define a range of to shift UV.
    godrayDestColor += texture2D(texture, shiftUv).rgb * weight; // draw gradation.
    godrayTotalWeight += weight;
  }
  vec3 godray = godrayDestColor / godrayTotalWeight;

  // Sum total of colors.
  vec3 color = vec3(texColorR, texColorG, texColorB) + rNoise + godray;

  gl_FragColor = vec4(color, 1.0);
}
