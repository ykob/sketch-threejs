#pragma glslify: rotationMatrixX = require(./rotation_matrix_x);
#pragma glslify: rotationMatrixY = require(./rotation_matrix_y);
#pragma glslify: rotationMatrixZ = require(./rotation_matrix_z);

mat4 rotationMatrix(float radian_x, float radian_y, float radian_z) {
  return rotationMatrixX(radian_x) * rotationMatrixY(radian_y) * rotationMatrixZ(radian_z);
}
#pragma glslify: export(rotationMatrix)
