attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec3 cameraPosition;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying float vEdge;

void main(void) {
  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position, 1.0);
  float angleToCamera = acos(dot(normalize(cameraPosition), (modelMatrix * vec4(normal, 1.0)).xyz));

  vPosition = mPosition.xyz;
  vUv = uv;
  vNormal = (viewMatrix * modelMatrix * vec4(normal, 1.0)).xyz;
  vEdge = pow(smoothstep(0.3, 1.0, abs(sin(angleToCamera))), 3.0);

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
