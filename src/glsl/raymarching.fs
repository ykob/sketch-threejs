precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying mat4 m_matrix;

// uniform vec3 cPos;
// uniform vec3 cDir;
// uniform vec3 cUp;

const vec3 lightDir = vec3(0.577, -0.577, 0.577);

#pragma glslify: hsv2rgb = require(./modules/hsv2rgb)
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
#pragma glslify: rotate = require(./modules/raymarching/rotate)
#pragma glslify: dBox = require(./modules/raymarching/dBox)

float getNoise(vec3 p) {
  return snoise3(p * 0.4 + time / 100.0);
}

vec3 getRotate(vec3 p) {
  return rotate(p, radians(time), radians(time * 2.0), radians(time));
}

float distanceFunc(vec3 p) {
  vec4 p1 = m_matrix * vec4(p, 1.0);
  float n1 = getNoise(p1.xyz);
  vec3 p2 = getRotate(p1.xyz);
  float d1 = dBox(p2, vec3(0.8)) - 0.2;
  float d2 = dBox(p2, vec3(1.0)) - n1;
  float d3 = dBox(p2, vec3(0.5)) - n1;
  return min(max(d1, -d2), d3);
}

float distanceFuncForFill(vec3 p) {
  vec4 p1 = m_matrix * vec4(p, 1.0);
  float n = getNoise(p1.xyz);
  vec3 p2 = getRotate(p1.xyz);
  return dBox(p2, vec3(0.5)) - n;
}

vec3 getNormal(vec3 p) {
  const float d = 0.1;
  return normalize(vec3(
    distanceFunc(p + vec3(d, 0.0, 0.0)) - distanceFunc(p + vec3(-d, 0.0, 0.0)),
    distanceFunc(p + vec3(0.0, d, 0.0)) - distanceFunc(p + vec3(0.0, -d, 0.0)),
    distanceFunc(p + vec3(0.0, 0.0, d)) - distanceFunc(p + vec3(0.0, 0.0, -d))
  ));
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  vec3 cPos = vec3(0.0, 0.0, 10.0);
  vec3 cDir = vec3(0.0, 0.0, -1.0);
  vec3 cUp  = vec3(0.0, 1.0, 0.0);
  vec3 cSide = cross(cDir, cUp);
  float targetDepth = 1.8;

  vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

  float distance = 0.0;
  float rLen = 0.0;
  vec3  rPos = cPos;
  for(int i = 0; i < 64; i++){
    distance = distanceFunc(rPos);
    rLen += distance;
    rPos = cPos + ray * rLen * 0.2;
  }

  vec3 normal = getNormal(rPos);
  if(abs(distance) < 0.5){
    if (distanceFuncForFill(rPos) > 0.5) {
      gl_FragColor = vec4(hsv2rgb(vec3(dot(normal, cUp) * 0.8 + time / 200.0, 0.2, dot(normal, cUp) * 0.8 + 0.1)), 1.0);
    } else {
      gl_FragColor = vec4(hsv2rgb(vec3(dot(normal, cUp) * 0.1 + time / 200.0, 0.8, dot(normal, cUp) * 0.2 + 0.8)), 1.0);
    }
  } else {
    gl_FragColor = vec4(0.0);
  }
}
