precision highp float;

varying vec2 vUv;
varying vec3 vColor;
varying float vOpacity;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  vec3 color = convertHsvToRgb(
    vColor +
    vec3(
      0.0,
      (1.0 - smoothstep(0.2, 0.6, length(p))) * -0.5,
      (1.0 - smoothstep(0.2, 0.6, length(p))) * 0.4
    )
  );
  float opacity = (1.0 - smoothstep(0.6, 1.0, length(p))) * vOpacity;

  if (opacity <= 0.01) discard;

  gl_FragColor = vec4(color, opacity);
}
