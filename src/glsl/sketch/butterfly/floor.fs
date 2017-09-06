precision highp float;

uniform sampler2D texture;

varying vec4 vUv;

void main() {
  vec4 projectorColor;
  if (all(bvec4(vUv.x >= 0.0, vUv.y >= 0.0, vUv.x <= vUv.z, vUv.y <= vUv.z))) {
    projectorColor = texture2DProj(texture, vUv);
  }
  gl_FragColor = vec4(vec3(1.0), 0.3) * projectorColor;
}
