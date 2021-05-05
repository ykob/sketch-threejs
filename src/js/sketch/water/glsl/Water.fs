precision highp float;

uniform mat4 modelMatrix;
uniform vec3 cameraPosition;
uniform float time;
uniform sampler2D tNormal;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  vec3 normal1 = texture2D(tNormal, vUv * 2.0 + vec2(time * 0.025, 0.0)).xyz * 2.0 - 1.0;
  vec3 normal2 = texture2D(tNormal, (vUv + vec2(0.0, 0.1)) * 1.2 + vec2(time * 0.09, 0.0)).xyz * 2.0 - 1.0;
  vec3 normal3 = texture2D(tNormal, (vUv + vec2(0.0, 0.6)) * 2.0 + vec2(time * -0.02, 0.0)).xyz * 2.0 - 1.0;
  vec3 normal4 = texture2D(tNormal, (vUv + vec2(0.0, 0.7)) * 1.2 + vec2(time * -0.08, 0.0)).xyz * 2.0 - 1.0;
  vec3 normal = (modelMatrix * vec4(normalize(normal1 + normal2 + normal3 + normal4), 1.0)).xyz;
  vec3 light = normalize(vec3(0.0, 1.0, 0.5));
  float diffuse = clamp(dot(normal, light), 0.0, 1.0);
  vec3 hsv = vec3(
    0.54 - diffuse * 0.1,
    1.0,
    diffuse * 2.0 - 0.5
  );
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb + pow(diffuse * 2.0, 30.0) * 0.1, 1.0);
}
