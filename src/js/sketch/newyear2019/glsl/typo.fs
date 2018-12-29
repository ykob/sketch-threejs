precision highp float;

uniform float time;
uniform sampler2D tex;
uniform float drawBrightOnly;

varying vec3 vPosition;
varying vec2 vUv;
varying float vTime1;
varying float vTime2;
varying float vTime3;
varying float vTime4;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  vec4 texColor = texture2D(tex, vUv);

  float noise = cnoise3(vPosition * vec3(1.6)) * 0.5 + 0.5;
  float opacity1 = smoothstep(0.0, 0.01, (1.2 - length(p)) + noise * 0.8 + vTime1 * 2.0 - 2.0);
  float opacity2 = smoothstep(0.0, 0.01, (1.2 - length(p)) + noise * 0.8 + vTime2 * 2.0 - 2.0);
  float opacity3 = smoothstep(0.0, 0.01, (1.2 - length(p)) + noise * 0.8 + vTime3 * 2.0 - 2.0);
  float opacity4 = smoothstep(0.0, 0.01, (1.2 - length(p)) + noise * 0.8 + vTime4 * 2.0 - 2.0);

  vec4 color1 = vec4(vec3(1.0, 1.0, 0.9), 0.9) * (opacity1 - opacity2);
  vec4 color2 = vec4(vec3(1.0, 1.0, 0.9), 0.05) * (opacity2 - opacity3);
  vec4 color3 = vec4(vec3(0.7, 0.1, 0.1), 0.9) * (opacity3 - opacity4);
  vec4 color4 = vec4(vec3(1.0, 1.0, 0.9), 0.05) * opacity4;

  if (texColor.a < 0.5) discard;
  gl_FragColor =
    (
      (color1 + color2 + color3 + color4) * (1.0 - drawBrightOnly)
      + vec4(vec3(0.0), opacity3 - opacity4) * drawBrightOnly
    )
    * vec4(vec3(1.0), texColor.a);
}
