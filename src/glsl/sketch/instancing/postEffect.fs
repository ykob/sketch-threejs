precision highp float;

uniform vec2 resolution;
uniform sampler2D texture;
uniform float strength;

varying vec2 vUv;

float rnd(vec3 scale, float seed){
    return fract(sin(dot(gl_FragCoord.stp + seed, scale)) * 43758.5453 + seed);
}

void main(void){
  vec2 tFrag = 1.0 / resolution;
  float nFrag = 1.0 / 30.0;
  vec2 centerOffset = resolution / 2.0;
  vec3 destColor = vec3(0.0);
  float random = rnd(vec3(12.9898, 78.233, 151.7182), 0.0);
  vec2 fcc = gl_FragCoord.xy - centerOffset;
  float totalWeight = 0.0;

  for(float i = 0.0; i <= 30.0; i++){
    float percent = (i + random) * nFrag;
    float weight = percent - percent * percent;
    vec2  t = gl_FragCoord.xy - fcc * percent * strength * nFrag;
    destColor += texture2D(texture, t * tFrag).rgb * weight;
    totalWeight += weight;
  }
  gl_FragColor = vec4(destColor / totalWeight, 1.0);
}
