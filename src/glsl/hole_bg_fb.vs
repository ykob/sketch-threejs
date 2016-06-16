uniform float time;

varying vec3 vColor;

#pragma glslify: hsv2rgb = require(./modules/hsv2rgb)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
  float noise = snoise3(
    vec3(position.x - time, position.y + time * 3.0, position.z + time) / 800.0
  );
  vColor = hsv2rgb(vec3(noise * 0.16 + time / 400.0, 0.5, 1.0));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
