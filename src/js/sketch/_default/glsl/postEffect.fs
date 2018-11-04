precision highp float;

uniform float time;
uniform sampler2D texture;
uniform vec2 resolution;

varying vec2 vUv;

float random2(vec2 c){
  return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
float randomNoise(vec2 p) {
  return (random2(p - vec2(sin(time))) * 2.0 - 1.0) * 0.04;
}

void main() {
  // Convert uv to the other vec2 has a range from -1.0 to 1.0.
  vec2 p = vUv * 2.0 - 1.0;
  vec2 ratio = vUv / resolution;

  float rNoise = randomNoise(vUv);

  float texColorR = texture2D(texture, vUv - vec2(6.0 * ratio.x * p.x, 0.0)).r;
  float texColorG = texture2D(texture, vUv + vec2(6.0 * ratio.x * p.x, 0.0)).g;
  float texColorB = texture2D(texture, vUv).b;

  gl_FragColor = vec4(vec3(texColorR, texColorG, texColorB) + rNoise, 1.0);
}
