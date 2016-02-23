uniform float time;

varying vec3 vColor;

uniform vec3 hemisphereLightDirection;
uniform vec3 hemisphereLightSkyColor;
uniform vec3 hemisphereLightGroundColor;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: hsv2rgb = require(./modules/hsv2rgb)

void main() {
  float updateTime = time / 1000.0;
  float noise = snoise3(vec3(position / 500.0 + updateTime * 4.0));
  vec4 mvPosition = modelViewMatrix * vec4(position * (noise * 0.2 + 1.0), 1.0);

  vec3 light = vec3(0.5);
  light += clamp(dot(-hemisphereLightDirection, normal), 0.1, 1.0) * hemisphereLightSkyColor * 0.6;
  light += clamp(dot(hemisphereLightDirection, normal), 0.1, 1.0) * hemisphereLightGroundColor * 0.6;
  //vNormal = (modelMatrix * vec4(normal, 0.0)).xyz;
  vColor = hsv2rgb(vec3(noise * 0.1 + updateTime, 0.5, 1.0)) * light;

  gl_Position = projectionMatrix * mvPosition;
}
