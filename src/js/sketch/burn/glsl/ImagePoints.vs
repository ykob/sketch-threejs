attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform float easeTransition;
uniform vec2 imgRatio;
uniform sampler2D noiseTex;
uniform float pixelRatio;

varying float vOpacity;

void main(void) {
  vec2 updateUv = uv * imgRatio + vec2(
    (1.0 - imgRatio.x) * 0.5,
    (1.0 - imgRatio.y) * 0.5
    );

  float noiseR = texture2D(noiseTex, updateUv + vec2(time * 0.1, 0.0)).r;
  float noiseG = texture2D(noiseTex, updateUv + vec2(time * 0.2, 0.0)).g;
  float slide = texture2D(noiseTex, uv * vec2(0.99) + 0.005).b;

  float mask = easeTransition * 1.24 - (slide * 0.6 + noiseR * 0.2 + noiseG * 0.2);
  float h = (easeTransition - slide) * 30.0;

  float opacity = smoothstep(0.3, 0.5, easeTransition * 2.0 - slide) * (1.0 - smoothstep(0.8, 1.0, easeTransition * 2.0 - slide)) * 0.8;

  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position + vec3(
    cos(radians(noiseR * 360.0 + time * 200.0)) * 0.1,
    sin(radians(noiseG * 360.0 + time * 200.0)) * 0.1,
    h
    ), 1.0);

  float distanceFromCamera = length((viewMatrix * mPosition).xyz);
  float pointSize = pixelRatio * 50.0 / distanceFromCamera * 4.0;

  vOpacity = opacity;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
  gl_PointSize = pointSize;
}
