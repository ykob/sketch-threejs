precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 cPos;

const float PI = 3.14159265;
const float angle = 60.0;
const float fov = angle * 0.5 * PI / 180.0;

const vec3 lightDir = vec3(-0.577, 0.577, 0.577);

vec3 trans(vec3 p){
  return mod(p, 16.0) - 8.0;
}

float getDistanceSphere(vec3 p, float r) {
  return length(p) - r;
}

float getDistanceBox(vec3 p, vec3 size) {
  return length(max(abs(p) - size, 0.0));
}

float sdCylinder( vec3 p, vec3 c ){
  return length(p.xz-c.xy)-c.z;
}

float getDistance(vec3 p) {
  float d_sphere = getDistanceSphere(p, 120.0);
	float d_box = getDistanceBox(p, vec3(100.0));
	float d1 = max(d_box, -d_sphere);
  float d_sphere2 = getDistanceSphere(p, 40.0);
  return min(d1, d_sphere2);
}

void main() {
  // fragment position
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  // camera
  //vec3 cPos = vec3(cos(time / 50.0) * 1.5, sin(time / 50.0) * 1.5, 10.0);
  vec3 cDir = vec3(-1.0, 0.0, 0.0);
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
      distance = getDistance(rPos);
      rLen += distance;
      rPos = cPos + ray * rLen;
  }

  // hit check
  if(abs(distance) < 0.001){
    gl_FragColor = vec4(vec3(1.0), 1.0);
  }else{
    gl_FragColor = vec4(vec3(0.0), 0.0);
  }
}
