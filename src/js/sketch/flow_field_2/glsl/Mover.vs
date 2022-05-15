attribute vec3 position;
attribute vec2 uvVelocity;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform vec2 resolution;
uniform float pixelRatio;
uniform sampler2D acceleration;
uniform sampler2D velocity;

varying vec3 vColor;
varying float vOpacity;

#pragma glslify: calcTranslateMat4 = require(@ykob/glsl-util/src/calcTranslateMat4);
#pragma glslify: calcScaleMat4 = require(@ykob/glsl-util/src/calcScaleMat4);
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
  vec3 a = texture2D(acceleration, uvVelocity).xyz;
  vec3 v = texture2D(velocity, uvVelocity).xyz;
  float alpha = texture2D(velocity, uvVelocity).w;

  // for scale.
  mat4 scaleMat = calcScaleMat4(vec3(1.0, length(a) * 3.0 + 0.1, 1.0));
  vec3 scaledPosition = (scaleMat * vec4(position, 1.0)).xyz;

  // for rotation.
  vec3 top = vec3(0.0, 1.0, 0.0);
  vec3 dir = normalize(a);
  vec3 axis = cross(top, dir);
  float angle = acos(dot(top, dir));
  Quaternion q = axisAngle(axis, angle);
  vec3 rotatedPosition = rotate(scaledPosition, q);
  
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
