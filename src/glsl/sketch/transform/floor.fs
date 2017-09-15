precision highp float;

uniform vec3 cameraPosition;
uniform sampler2D texture;

varying vec3 vPosition;
varying vec4 vUv;

void main() {
  float opacity = clamp(1.0 - length(vPosition - cameraPosition) / 1000.0, 0.0, 1.0) * 0.3;
  vec4 mirrorColor = vec4(vec3(1.0), opacity);

  vec4 projectorColor;
  if (all(bvec4(vUv.x >= 0.0, vUv.y >= 0.0, vUv.x <= vUv.z, vUv.y <= vUv.z))) {
    projectorColor = texture2DProj(texture, vUv);
  }

  gl_FragColor = mirrorColor * projectorColor;
}
