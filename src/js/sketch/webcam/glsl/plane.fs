precision highp float;

uniform float time;
uniform sampler2D texVideo;
uniform float facing;
uniform vec2 resolution;
uniform float force;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  vec2 p = (vUv * 2.0 - 1.0);
  float grad = 1.0 - smoothstep(0.5, 1.0, length(p));
  float noise1 = cnoise3(vec3(p * (1.4 + force * 0.5), time * 0.4)) * (0.15 + smoothstep(0.5, 0.75, length(p)) * (1.0 - smoothstep(0.75, 1.0, length(p))));
  float noise2 = cnoise3(vec3(p * (5.4 + force * 0.3), time * 0.4)) * (0.15 + smoothstep(0.3, 0.4, length(p)) * (1.0 - smoothstep(0.9, 1.0, length(p))));
  float noiseSum = (noise1 + noise2) / 2.0;

  vec2 adjustUv = vec2(
    min(resolution.y / resolution.x, 1.0) * (1.0 + force * 0.03),
    min(resolution.x / resolution.y, 1.0) * (1.0 + force * 0.03)
    );
  vec2 updateUv = vec2(
    abs(vUv.x - facing) * adjustUv.x + (1.0 - adjustUv.x) * 0.5,
                  vUv.y * adjustUv.y + (1.0 - adjustUv.y) * 0.5
                  );
  vec4 texColor1 = texture2D(texVideo, updateUv - vec2(noise1 * noise2 - abs(p.x) / 50.0));
  vec4 texColor2 = texture2D(texVideo, updateUv - vec2(noise1 * noise2));
  vec4 texColor3 = texture2D(texVideo, updateUv - vec2(noise1 * noise2 + abs(p.x) / 50.0));
  vec3 texColorSum = vec3(texColor1.r, texColor2.g, texColor3.b);

  vec3 addColor = convertHsvToRgb(vec3((grad + noiseSum + updateUv.x * 0.5) / 2.0 + time * 0.1, 0.8, 0.6));

  float mask1 = smoothstep(0.19, 0.2, grad + noiseSum);
  vec4 color1 = vec4(texColorSum * vec3(1.2) + addColor * 0.24, 1.0) * mask1;

  float mask2 = smoothstep(0.15, 0.16, grad + noiseSum) * (1.0 - smoothstep(0.7, 0.71, grad + noiseSum));
  vec4 color2 = vec4(texColorSum * 0.1 + addColor * 0.7, 1.0) * mask2;

  gl_FragColor = color1 + color2;
}
