precision highp float;

uniform float time;

varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);
#pragma glslify: ease = require(glsl-easings/exponential-out);

void main() {
  float t1 = ease(min(time, 1.0) / 1.0);
  float t2 = ease(clamp(time - 14.0, 0.0, 1.0) / 1.0);
  vec2 pos = vUv * 2.0 - vec2(1.0);
  float circleOut = smoothstep(0.0, 0.5, t1 - t2 - length(pos));
  float circleIn = smoothstep(0.0, 0.5, (t1 - t2) * 0.5 - length(pos));
  float noise = (snoise3(vec3(pos * 1.6 + vec2(sin(time), cos(time)), time)) + 1.0) / 2.0;
  float mask = circleOut * noise + circleIn;
  float opacity = 1.0 - step(mask, 0.3);
  float h1 = step(mask, 0.99) * 0.4 - time * 0.05;
  float h2 = step(mask, 0.4) * 0.5;
  vec3 hsv = vec3(h1 - h2, 0.45, 0.8);
  vec3 rgb = convertHsvToRgb(hsv);
  gl_FragColor = vec4(rgb, opacity);
}
