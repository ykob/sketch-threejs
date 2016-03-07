precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

const float sphere_size = 1.0;
const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

vec3 trans(vec3 p){
  return mod(p, 16.0) - 8.0;
}

float getDistance(vec3 p) {
  return length(trans(p)) - sphere_size;
}

vec3 getNormal(vec3 p){
  float d = 0.0001;
  return normalize(vec3(
    getDistance(p + vec3(  d, 0.0, 0.0)) - getDistance(p + vec3( -d, 0.0, 0.0)),
    getDistance(p + vec3(0.0,   d, 0.0)) - getDistance(p + vec3(0.0,  -d, 0.0)),
    getDistance(p + vec3(0.0, 0.0,   d)) - getDistance(p + vec3(0.0, 0.0,  -d))
  ));
}

void main() {
  // fragment position
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  // camera
  vec3 cPos = vec3(0.0, 0.0, 0.0);
  vec3 cDir = vec3(0.0, 0.0, -1.0);
  vec3 cUp  = vec3(0.0, 1.0, 0.0);
  vec3 cSide = cross(cDir, cUp);
  float targetDepth = 4.0;

  // ray
  vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

  // marching loop
  float distance = 0.0; // レイとオブジェクト間の最短距離
  float rLen = 0.0;     // レイに継ぎ足す長さ
  vec3  rPos = cPos;    // レイの先端位置
  for(int i = 0; i < 256; i++){
      distance = getDistance(rPos);
      rLen += distance;
      rPos = cPos + vec3(mouse * 3.0, 0.0) + ray * rLen;
  }

  // hit check
  if(abs(distance) < 0.001){
    vec3 normal = getNormal(rPos);
    float diff = clamp(dot(lightDir, normal), 0.1, 1.0);
    gl_FragColor = vec4(vec3(diff), 1.0);
  }else{
      gl_FragColor = vec4(vec3(0.0), 1.0);
  }
}
