precision highp float;

uniform vec3 cameraPosition;
uniform float time;
uniform sampler2D texture;
uniform vec3 projectorPosition;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vUv;
varying mat4 vInvertMatrix;

void main() {
  vec4 projectorColor;
  if (all(bvec4(vUv.x >= 0.0, vUv.y >= 0.0, vUv.x <= vUv.z, vUv.y <= vUv.z))) {
    projectorColor = texture2DProj(texture, vUv);
  }
  gl_FragColor = vec4(0.0, 0.2, 0.3, 1.0) + projectorColor;
}
