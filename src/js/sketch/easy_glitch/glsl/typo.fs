precision highp float;

uniform float time;
uniform sampler2D texture;
uniform sampler2D textureNoise;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: random = require(@ykob/glsl-util/src/random);

vec4 getGlitchColor(vec2 uv, float force) {
  vec2 r = vec2(
    random(vec2(ceil(time * 20.0), 0.0)) * 2.0 - 1.0,
    random(vec2(0.0, ceil(time * 20.0))) * 2.0 - 1.0
  );
  vec2 noiseUv = uv + r * 0.001;
  float mask = smoothstep(
    length(vec3(1.0)) - force * 0.004,
    length(vec3(1.0)),
    length(texture2D(textureNoise, uv * vec2(0.2, 0.4) * r).rgb)
    );
  vec4 texColor = texture2D(texture, noiseUv + r * 0.01 * force) * (1.0 - mask);
  vec4 texColorDiff = texture2D(texture, noiseUv + r * force) * mask;
  return texColor + texColorDiff;
}

void main() {
  float shake = random(vec2(time));
  float force = smoothstep(0.5, 1.0, sin(time * 4.0) * 0.8 + sin(time * 5.0) + 0.2);

  vec2 uvR = vUv + vec2(-0.008 - shake * 0.002, 0.0);
  vec2 uvG = vUv + vec2( 0.0, 0.0);
  vec2 uvB = vUv + vec2( 0.008 + shake * 0.002, 0.0);

  vec4 r = getGlitchColor(uvR, force) * vec4(1.0, 0.0, 0.0, 1.0);
  vec4 g = getGlitchColor(uvG, force) * vec4(0.0, 1.0, 0.0, 1.0);
  vec4 b = getGlitchColor(uvB, force) * vec4(0.0, 0.0, 1.0, 1.0);
  vec4 color = r + g + b;

  if (color.a < 0.1) discard;

  gl_FragColor = color;
}
