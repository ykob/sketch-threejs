precision highp float;

uniform float time;
uniform sampler2D texture;

varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: ease = require(glsl-easings/cubic-out)

const float interval = 3.0;

void main() {
  float now = time / interval;
  float noise = (snoise3(vec3(vUv.x * 12.0, vUv.y * 3.0, 1.0)) + 1.0) / 2.0;
  float opacity = smoothstep(0.49, 0.51, (noise - 1.0) + now * 2.0 - (1.0 - now) * vUv.x * 2.0);
  gl_FragColor = texture2D(texture, vUv) * vec4(vec3(1.0), opacity);
}
