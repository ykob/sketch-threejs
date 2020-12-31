#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate(a) clamp(a, 0.0, 1.0)
#endif
#define whiteComplement(a) (1.0 - saturate(a))
float pow2(const in float x) { return x*x; }
float pow3(const in float x) { return x*x*x; }
float pow4(const in float x) { float x2 = x*x; return x2*x2; }
float average(const in vec3 color) { return dot(color, vec3(0.3333)); }
highp float rand(const in vec2 uv) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot(uv.xy, vec2(a,b)), sn = mod(dt, PI);
	return fract(sin(sn) * c);
}
#ifdef HIGH_PRECISION
	float precisionSafeLength(vec3 v) { return length(v); }
#else
	float max3(vec3 v) { return max(max(v.x, v.y), v.z); }
	float precisionSafeLength(vec3 v) {
		float maxComponent = max3(abs(v));
		return length(v / maxComponent) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
vec3 transformDirection(in vec3 dir, in mat4 matrix) {
	return normalize((matrix * vec4(dir, 0.0)).xyz);
}
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {
	return normalize((vec4(dir, 0.0) * matrix).xyz);
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal) {
	float distance = dot(planeNormal, point - pointOnPlane);
	return - distance * planeNormal + point;
}
float sideOfPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal) {
	return sign(dot(point - pointOnPlane, planeNormal));
}
vec3 linePlaneIntersect(in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal) {
	return lineDirection * (dot(planeNormal, pointOnPlane - pointOnLine) / dot(planeNormal, lineDirection)) + pointOnLine;
}
mat3 transposeMat3(const in mat3 m) {
	mat3 tmp;
	tmp[ 0 ] = vec3(m[ 0 ].x, m[ 1 ].x, m[ 2 ].x);
	tmp[ 1 ] = vec3(m[ 0 ].y, m[ 1 ].y, m[ 2 ].y);
	tmp[ 2 ] = vec3(m[ 0 ].z, m[ 1 ].z, m[ 2 ].z);
	return tmp;
}
float linearToRelativeLuminance(const in vec3 color) {
	vec3 weights = vec3(0.2126, 0.7152, 0.0722);
	return dot(weights, color.rgb);
}
bool isPerspectiveMatrix(mat4 m) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv(in vec3 dir) {
	float u = atan(dir.z, dir.x) * RECIPROCAL_PI2 + 0.5;
	float v = asin(clamp(dir.y, - 1.0, 1.0)) * RECIPROCAL_PI + 0.5;
	return vec2(u, v);
}
#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	#ifdef BONE_TEXTURE
		uniform highp sampler2D boneTexture;
		uniform int boneTextureSize;
		mat4 getBoneMatrix(const in float i) {
			float j = i * 4.0;
			float x = mod(j, float(boneTextureSize));
			float y = floor(j / float(boneTextureSize));
			float dx = 1.0 / float(boneTextureSize);
			float dy = 1.0 / float(boneTextureSize);
			y = dy * (y + 0.5);
			vec4 v1 = texture2D(boneTexture, vec2(dx * (x + 0.5), y));
			vec4 v2 = texture2D(boneTexture, vec2(dx * (x + 1.5), y));
			vec4 v3 = texture2D(boneTexture, vec2(dx * (x + 2.5), y));
			vec4 v4 = texture2D(boneTexture, vec2(dx * (x + 3.5), y));
			mat4 bone = mat4(v1, v2, v3, v4);
			return bone;
		}
	#else
		uniform mat4 boneMatrices[ MAX_BONES ];
		mat4 getBoneMatrix(const in float i) {
			mat4 bone = boneMatrices[ int(i) ];
			return bone;
		}
	#endif
#endif

varying vec2 vUv;

void main() {
  vec3 transformed = vec3(position);

  #ifdef USE_SKINNING
    mat4 boneMatX = getBoneMatrix(skinIndex.x);
    mat4 boneMatY = getBoneMatrix(skinIndex.y);
    mat4 boneMatZ = getBoneMatrix(skinIndex.z);
    mat4 boneMatW = getBoneMatrix(skinIndex.w);
    vec4 skinVertex = bindMatrix * vec4(transformed, 1.0);
    vec4 skinned = vec4(0.0);

    skinned += boneMatX * skinVertex * skinWeight.x;
    skinned += boneMatY * skinVertex * skinWeight.y;
    skinned += boneMatZ * skinVertex * skinWeight.z;
    skinned += boneMatW * skinVertex * skinWeight.w;
    transformed = (bindMatrixInverse * skinned).xyz;
  #endif

  vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);

  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}