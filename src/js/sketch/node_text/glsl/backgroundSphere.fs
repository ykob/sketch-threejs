precision highp float;

uniform float time;
uniform sampler2D tex;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;

#pragma glslify: random = require(@ykob/glsl-util/src/random);

void main() {
  float noise = random(vUv) * 0.08;

  gl_FragColor = vec4(vColor + noise, 1.0);
}
