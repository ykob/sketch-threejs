uniform float time;

varying vec3 vColor;

#pragma glslify: hsv2rgb = require(../../../old/glsl/hsv2rgb)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main() {
  float noise = snoise3(
    vec3(position.x + time * 10.0, position.y + cos(time / 20.0) * 100.0, position.z + time * 10.0) / 800.0
  );
  vColor = hsv2rgb(vec3(noise * 0.2 + 0.75, 0.4, noise * 0.3 + 0.5));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
