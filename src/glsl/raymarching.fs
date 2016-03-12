precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

vec3 trans(vec3 p){
  return mod(p, 16.0) - 8.0;
}

float field(vec3 p) {
  return 1.0 - dot(p, vec3(0.0, 1.0, 0.0));
}

float getDistanceSphere(vec3 p, float r) {
  return length(p) - r;
}

float getDistanceBox(vec3 p, vec3 size) {
  return length(max(abs(trans(p)) - size, 0.0));
}

float distanceFunc(vec3 p) {
  float d_sphere = getDistanceBox(p, vec3(1.0));
  float d_field = field(p);
  return max(d_sphere, -d_field);
}

vec3 getNormal(vec3 p) {
  const float d = 0.0001;
  return normalize(vec3(
    distanceFunc(p + vec3(d, 0.0, 0.0)) - distanceFunc(p + vec3(-d, 0.0, 0.0)),
    distanceFunc(p + vec3(0.0, d, 0.0)) - distanceFunc(p + vec3(0.0, -d, 0.0)),
    distanceFunc(p + vec3(0.0, 0.0, d)) - distanceFunc(p + vec3(0.0, 0.0, -d))
  ));
}

void main() {
  // fragment position
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  // camera
  vec3 cPos = vec3(0.0, 0.0, 10.0);
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
  for(int i = 0; i < 128; i++){
      distance = distanceFunc(rPos);
      rLen += distance;
      rPos = cPos + ray * rLen;
  }

  // hit check
  vec3 normal = getNormal(rPos);
  if(abs(distance) < 0.001){
    gl_FragColor = vec4(normal, 1.0);
  }else{
    gl_FragColor = vec4(vec3(0.0), 1.0);
  }
}
