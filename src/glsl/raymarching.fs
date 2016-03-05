precision highp float;
uniform float time;
uniform vec2 resolution;
// 微小な値
const float EPS = 0.001;
// 距離関数
float distSphere(vec3 p, float r) {
  return length(p) - r;
}
float distScene(vec3 p) {
  return distSphere(p, 1.3);
}
// 法線の計算
vec3 getNormal(vec3 p) {
  return normalize(vec3(
    distScene(p + vec3(  EPS, 0.0, 0.0)) - distScene(p + vec3( -EPS, 0.0, 0.0)),
    distScene(p + vec3(0.0,   EPS, 0.0)) - distScene(p + vec3(0.0,  -EPS, 0.0)),
    distScene(p + vec3(0.0, 0.0,   EPS)) - distScene(p + vec3(0.0, 0.0,  -EPS))
  ));
}
void main(void) {
  // gl_FragCoord.xy の正規化
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  // カメラとレイの定義
  vec3 cPos  = vec3(0.0, 1.6, -2.0);
  vec3 cDir  = normalize(vec3(0.0, -0.9, 1.0));
  vec3 cUp   = cross(cDir, vec3(1.0, 0.0 ,0.0));
  vec3 cSide = cross(cDir, cUp);
  float targetDepth = 1.3;
  vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
  // 距離関数を用いたレイのマーチングループ
  float dist;
  float depth = 0.0;
  vec3 dPos = cPos;
  for (int i = 0; i < 32; i++) {
    dist = distScene(dPos);
    depth += dist;
    dPos = cPos + depth * ray;
    if (abs(dist) < EPS) break;
  }
  // 衝突判定の結果に応じたピクセル色の決定
  vec3 lightDir = normalize(vec3(-3, 5, -2));
  vec3 color;
  if (abs(dist) < EPS) {
    // 衝突した場合
    vec3 normal = getNormal(dPos);
    float diffuse = clamp(dot(lightDir, normal), 0.1, 1.0);
    color = vec3(1.0, 1.0, 1.0) * diffuse;
  } else {
    // 衝突しなかった場合
    color = vec3(1.0);
  }
  gl_FragColor = vec4(color, 1.0);
}
