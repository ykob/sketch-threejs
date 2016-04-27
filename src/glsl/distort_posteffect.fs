uniform vec2 resolution;
uniform sampler2D texture;

const float blur = 16.0;

varying vec2 vUv;

void main() {
    vec4 color = vec4(0.0);

    for (float x = 0.0; x < blur; x++){
      for (float y = 0.0; y < blur; y++){
        color += texture2D(texture, vUv - (vec2(x, y) - vec2(blur / 2.0)) / resolution);
      }
    }
    gl_FragColor = color / pow(blur, 2.0);
}
