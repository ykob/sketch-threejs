attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform float easeTransition;
uniform vec2 imgRatio;
uniform sampler2D noiseTex;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;
varying float vTime;

void main(void) {
  vec2 p = uv * 2.0 - 1.0;
  float edge = abs(p.x);

  vec2 updateUv = uv * imgRatio + vec2(
    (1.0 - imgRatio.x) * 0.5,
    (1.0 - imgRatio.y) * 0.5
    );

  float noiseR = texture2D(noiseTex, updateUv + vec2(time * 0.1, 0.0)).r;
  float noiseG = texture2D(noiseTex, updateUv + vec2(time * 0.2, 0.0)).g;
  float slide = texture2D(noiseTex, uv * vec2(0.998) + 0.001).b;

  float mask = easeTransition * 1.16 - (slide * 0.6 + noiseR * 0.2 + noiseG * 0.2);
  float h = (1.0 - smoothstep(0.0, 0.16, mask)) * 16.0;

  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position + vec3(0.0, h * 0.006, h), 1.0);

  float opacity = smoothstep(0.0, 1.0, h) * (1.0 - smoothstep(8.0, 16.0, h)) * (1.0 - pow(edge, 2.0));

  vPosition = mPosition.xyz;
  vUv = uv;
  vOpacity = opacity;
  vTime = easeTransition;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
