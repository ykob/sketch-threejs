precision highp float;

uniform float time;
uniform sampler2D objOutline;

varying vec3 vPosition;
varying vec2 vUv;

const float blurIteration = 8.0;

void main() {
  // calculate blur mask.
  vec4 destColor = vec4(0.0);
  for (float i = 0.0; i < blurIteration; i++) {
    for (float j = 0.0; j < blurIteration; j++) {
      vec2 p = (vec2(i, j) / blurIteration * 2.0 - 1.0) / 512.0 * 60.0;
      destColor += texture2D(objOutline, vUv + p) / pow(blurIteration, 2.0);
    }
  }
  float blurMask = smoothstep(0.0, 0.6, destColor.r) * (1.0 - smoothstep(0.4, 1.0, destColor.r));

  gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), blurMask);
}
