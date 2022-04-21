precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D noiseTex;

varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  vec2 updateUv = vec2(
    vUv.x * min(resolution.x / resolution.y, 1.0) + max(1.0 - resolution.x / resolution.y, 0.0) / 2.0,
    vUv.y * min(resolution.y / resolution.x, 1.0) + max(1.0 - resolution.y / resolution.x, 0.0) / 2.0
  );
  vec2 p = updateUv * 2.0 - 1.0;
  vec4 texColor1 = texture2D(noiseTex, updateUv + vec2(0.0, time * 0.01));
  vec4 texColor2 = texture2D(noiseTex, updateUv - vec2(0.0, time * 0.02));
  vec3 hsv1 = vec3(0.5 + time * 0.1 + vUv.y * 0.5, 0.4, 0.05);
  vec3 hsv2 = vec3(1.2 + time * 0.1 + vUv.y * 0.5, 0.4, 0.4);
  float hsvAlpha = pow((texColor1.r + texColor2.g) / 2.0, 3.0) * 2.0;
  vec3 color = convertHsvToRgb(mix(hsv1, hsv2, hsvAlpha) - (1.0 - smoothstep(0.0, 1.0, length(p))) * 0.3);

  gl_FragColor = vec4(color, 1.0);
}
