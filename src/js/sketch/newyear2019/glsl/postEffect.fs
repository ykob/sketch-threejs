precision highp float;

uniform float time;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec2 resolution;

varying vec2 vUv;

const float godrayIteration = 60.0;
const float godrayStrength = 24.0;

float random2(vec2 c){
  return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
float randomNoise(vec2 p) {
  return (random2(p - vec2(sin(time))) * 2.0 - 1.0) * 0.02;
}

void main() {
  // Convert uv to the other vec2 has a range from -1.0 to 1.0.
  vec2 p = vUv * 2.0 - 1.0;
  vec2 ratio = 1.0 / resolution;

  // Random Noise
  float rNoise = randomNoise(vUv);

  // get texture color.
  vec4 texColor = texture2D(texture1, vUv);

  // godray
  vec2 godrayCenter = vec2(0.5);
  vec3 godrayDestColor = vec3(0.0);
  float godrayTotalWeight = 0.0;

  for (float i = 0.0; i < 60.0; i++) {
    float alpha = i / godrayIteration; // step in loop [0, 1].
    float weight = alpha - alpha * alpha; // conic curve [0, 0.25, 0].
    vec2 shiftUv = vUv - (vUv - godrayCenter) * alpha * godrayStrength / godrayIteration; // define a range of to shift UV.
    godrayDestColor += texture2D(texture2, shiftUv).rgb * weight; // draw gradation.
    godrayTotalWeight += weight;
  }
  vec3 godray = godrayDestColor / godrayTotalWeight;

  // Sum total of colors.
  vec3 color = texColor.rgb + rNoise + godray * 0.5;

  gl_FragColor = vec4(color, 1.0);
}
