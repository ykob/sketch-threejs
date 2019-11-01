attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 directionalShadowMatrix[NUM_DIR_LIGHT_SHADOWS];

varying vec3 vPosition;
varying vec2 vUv;
varying vec4 vDirectionalShadowCoord[NUM_DIR_LIGHT_SHADOWS];

void main(void) {
  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position, 1.0);

  vPosition = position;
  vUv = uv;

  #if NUM_DIR_LIGHT_SHADOWS > 0
    #pragma unroll_loop
    for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
      vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * mPosition;
    }
  #endif

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
