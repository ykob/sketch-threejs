attribute vec3 position;
attribute vec2 uv;
attribute vec2 uvVelocity;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform sampler2D acceleration;
uniform sampler2D velocity;
uniform sampler2D velocity1;
uniform sampler2D velocity2;
uniform sampler2D velocity3;
uniform sampler2D velocity4;
uniform sampler2D velocity5;
uniform sampler2D velocity6;
uniform sampler2D velocity7;
uniform sampler2D velocity8;
uniform sampler2D velocity9;

varying vec3 vColor;
varying float vOpacity;

#pragma glslify: calcTranslateMat4 = require(@ykob/glsl-util/src/calcTranslateMat4);
#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

struct Quaternion {
  float x;
  float y;
  float z;
  float w;
};

// https://qiita.com/aa_debdeb/items/c34a3088b2d8d3731813
Quaternion axisAngle(vec3 axis, float radian) {
  vec3 naxis = normalize(axis);
  float h = 0.5 * radian;
  float s = sin(h);
  return Quaternion(naxis.x * s, naxis.y * s, naxis.z * s, cos(h));
}

Quaternion conjugate(Quaternion q) {
  return Quaternion(-q.x, -q.y, -q.z, q.w);
}

Quaternion mul(Quaternion q, float f) {
  return Quaternion(f * q.x, f * q.y, f * q.z, f * q.w);
}

Quaternion mul(Quaternion q1, Quaternion q2) {
  return Quaternion(
    q2.w * q1.x - q2.z * q1.y + q2.y * q1.z + q2.x * q1.w,
    q2.z * q1.x + q2.w * q1.y - q2.x * q1.z + q2.y * q1.w,
    -q2.y * q1.x + q2.x * q1.y + q2.w * q1.z + q2.z * q1.w,
    -q2.x * q1.x - q2.y * q1.y - q2.z * q1.z + q2.w * q1.w
  );
}

vec3 rotate(vec3 v, Quaternion q) {
  // norm of q must be 1.
  Quaternion vq = Quaternion(v.x, v.y, v.z, 0.0);
  Quaternion cq = conjugate(q);
  Quaternion mq = mul(mul(cq, vq), q);
  return vec3(mq.x, mq.y, mq.z);
}

void main() {
  float y = position.y + 0.5;
  vec3 a = texture2D(acceleration, uvVelocity).xyz;
  vec3 v0 = texture2D(velocity, uvVelocity).xyz;
  vec3 v1 = texture2D(velocity1, uvVelocity).xyz;
  vec3 v2 = texture2D(velocity2, uvVelocity).xyz;
  vec3 v3 = texture2D(velocity3, uvVelocity).xyz;
  vec3 v4 = texture2D(velocity4, uvVelocity).xyz;
  vec3 v5 = texture2D(velocity5, uvVelocity).xyz;
  vec3 v6 = texture2D(velocity6, uvVelocity).xyz;
  vec3 v7 = texture2D(velocity7, uvVelocity).xyz;
  vec3 v8 = texture2D(velocity8, uvVelocity).xyz;
  vec3 v9 = texture2D(velocity9, uvVelocity).xyz;
  vec3 v =
    v0 * step(0.0, y) * (1.0 - step(1.0 / 10.0, y)) +
    v1 * step(1.0 / 10.0, y) * (1.0 - step(2.0 / 10.0, y)) +
    v2 * step(2.0 / 10.0, y) * (1.0 - step(3.0 / 10.0, y)) +
    v3 * step(3.0 / 10.0, y) * (1.0 - step(4.0 / 10.0, y)) +
    v4 * step(4.0 / 10.0, y) * (1.0 - step(5.0 / 10.0, y)) +
    v5 * step(5.0 / 10.0, y) * (1.0 - step(6.0 / 10.0, y)) +
    v6 * step(6.0 / 10.0, y) * (1.0 - step(7.0 / 10.0, y)) +
    v7 * step(7.0 / 10.0, y) * (1.0 - step(8.0 / 10.0, y)) +
    v8 * step(8.0 / 10.0, y) * (1.0 - step(9.0 / 10.0, y)) +
    v9 * step(9.0 / 10.0, y);
  vec3 pv =
    (v + a) * (1.0 - step(1.0 / 10.0, y)) +
    v0 * step(1.0 / 10.0, y) * (1.0 - step(2.0 / 10.0, y)) +
    v1 * step(2.0 / 10.0, y) * (1.0 - step(3.0 / 10.0, y)) +
    v2 * step(3.0 / 10.0, y) * (1.0 - step(4.0 / 10.0, y)) +
    v3 * step(4.0 / 10.0, y) * (1.0 - step(5.0 / 10.0, y)) +
    v4 * step(5.0 / 10.0, y) * (1.0 - step(6.0 / 10.0, y)) +
    v5 * step(6.0 / 10.0, y) * (1.0 - step(7.0 / 10.0, y)) +
    v6 * step(7.0 / 10.0, y) * (1.0 - step(8.0 / 10.0, y)) +
    v7 * step(8.0 / 10.0, y) * (1.0 - step(9.0 / 10.0, y)) +
    v8 * step(9.0 / 10.0, y);
  float alpha = texture2D(velocity, uvVelocity).w;

  // for rotation.
  vec3 top = vec3(0.0, 1.0, 0.0);
  vec3 dir = normalize(pv - v);
  vec3 axis = cross(top, dir);
  float angle = acos(dot(top, dir));
  Quaternion q = axisAngle(axis, angle);
  vec3 rotatedPosition = rotate(position, q);
  
  vec4 mvPosition = modelViewMatrix * calcTranslateMat4(v) * vec4(rotatedPosition, 1.0);

  // Define the point size.
  float distanceFromCamera = length(mvPosition.xyz);

  vColor = convertHsvToRgb(
    vec3(
      degrees(angle) / 180.0,
      0.45,
      0.8
    )
  );
  vOpacity = alpha;

  gl_Position = projectionMatrix * mvPosition;
}
