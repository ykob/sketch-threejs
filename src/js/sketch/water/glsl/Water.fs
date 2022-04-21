precision highp float;

uniform mat4 modelMatrix;
uniform vec3 cameraPosition;
uniform float time;
uniform vec2 resolution;
uniform sampler2D tScene;
uniform sampler2D tNormal;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb)

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  vec3 light = normalize(vec3(0.0, 1.0, 0.0));

  vec3 normal1 = texture2D(tNormal, (vUv + vec2(0.0, 0.2)) + vec2( time,  time) * 0.02).xyz * 2.0 - 1.0;
  vec3 normal2 = texture2D(tNormal, (vUv + vec2(0.0, 0.4)) + vec2( time, -time) * 0.02).xyz * 2.0 - 1.0;
  vec3 normal3 = texture2D(tNormal, (vUv + vec2(0.0, 0.6)) + vec2(-time,  time) * 0.02).xyz * 2.0 - 1.0;
  vec3 normal4 = texture2D(tNormal, (vUv + vec2(0.0, 0.8)) + vec2(-time, -time) * 0.02).xyz * 2.0 - 1.0;
  vec3 normal = normalize(normal1 + normal2 + normal3 + normal4);

  float angleToCamera = acos(dot(normalize(vPosition - cameraPosition), normal));
  float diffuse = clamp(dot(normal, light), 0.0, 1.0);

  vec3 hsv = vec3(0.52, 1.0, 0.0);
  vec3 rgb = convertHsvToRgb(hsv);
  float edgeGradual = (1.0 - smoothstep(0.5, 1.0, length(p)));

  vec2 uv = gl_FragCoord.xy / resolution;
  vec4 tSceneColor = texture2D(tScene, uv + normal.xy * 0.1);

  gl_FragColor = vec4((rgb + diffuse) * edgeGradual + tSceneColor.rgb, 1.0);
}
