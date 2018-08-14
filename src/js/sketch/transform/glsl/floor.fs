precision highp float;

uniform vec3 cameraPosition;
uniform sampler2D texture;

varying vec3 vPosition;
varying vec4 vUv;

const float mirrorOpacity = 0.2;

void main() {
  float opacity = 1.0 - length(vPosition - cameraPosition) / 700.0;

  vec4 mirrorColor = vec4(vec3(0.9), 1.0) * (1.0 - mirrorOpacity);

  vec4 projectorColor = texture2DProj(texture, vUv) * mirrorOpacity;

  gl_FragColor = (mirrorColor + projectorColor) * vec4(vec3(1.0), opacity);
}
