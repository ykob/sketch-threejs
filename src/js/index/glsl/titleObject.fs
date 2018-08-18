precision highp float;

uniform float time;
uniform sampler2D texture;

varying vec2 vUv;

const float interval = 3.0;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: ease = require(glsl-easings/cubic-out)

void main() {
  float now = ease(min(time / interval, 1.0));
  float noise = (snoise3(vec3(vUv.x * 4.0, vUv.y * 4.0, 1.0)) + 1.0) / 2.0;
  float opacity = smoothstep(0.4, 0.6, ((noise - 1.0) + now * interval) - vUv.x);
  gl_FragColor = texture2D(texture, vUv) * vec4(vec3(1.0), opacity);
}
