precision highp float;

uniform float time;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  float noise = snoise3(
    vPosition * vec3(0.004, 0.0015, 0.004) + vec3(time * 2.6, -time * 3.6, time * 2.6)
    );
  float opacity = smoothstep(0.0, 0.6, (noise + 1.0) / 2.0 - (1.0 - smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.2, 1.0, vUv.y))));
  vec3 hsv = vec3(0.0 + opacity * 0.08, 0.7 - opacity * 0.2, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, opacity);
}
