precision highp float;

uniform float time;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;
varying float vRotate1;
varying float vRotate2;
varying float vRotate3;

mat3 rotateMat3(float radian) {
  return mat3(
    cos(radian), -sin(radian), 0.0,
    sin(radian), cos(radian), 0.0,
    0.0, 0.0, 1.0
  );
}

void main() {
  // rotate textures
  vec2 uv1 = ((vec3(vUv - 0.5, 1.0) * rotateMat3(time * vRotate1)).xy + 0.5);
  vec2 uv2 = ((vec3(vUv - 0.5, 1.0) * rotateMat3(time * vRotate2)).xy + 0.5);
  vec2 uv3 = ((vec3(vUv - 0.5, 1.0) * rotateMat3(time * vRotate3)).xy + 0.5);
  vec4 texColor1 = texture2D(texture1, uv1);
  vec4 texColor2 = texture2D(texture2, uv2);
  vec4 texColor3 = texture2D(texture3, uv3);
  vec4 color = texColor1 + texColor2 + texColor3;

  // discard low alpha value
  if (color.a <= 0.1) discard;

  gl_FragColor = vec4(vColor, color.a * 0.35);
}
