const glMatrix = require('gl-matrix');

export default {
  updateVelocity: (velocity, acceleration, mass) => {
    glMatrix.vec3.scale(acceleration, acceleration, 1 / mass);
    glMatrix.vec3.add(velocity, velocity, acceleration);
  },
  applyFriction: (acceleration, mu, n) => {
    const friction = [0, 0, 0];
    glMatrix.vec3.scale(friction, acceleration, -1);
    const normal = (n) ? n : 1;
    glMatrix.vec3.normalize(friction, friction);
    glMatrix.vec3.scale(friction, friction, mu);
    glMatrix.vec3.add(acceleration, acceleration, friction);
  },
  applyDrag: (acceleration, value) => {
    const drag = [0, 0, 0];
    glMatrix.vec3.scale(drag, acceleration, -1);
    glMatrix.vec3.normalize(drag, drag);
    glMatrix.vec3.scale(drag, drag, glMatrix.vec3.length(acceleration) * value);
    glMatrix.vec3.add(acceleration, acceleration, drag);
  },
  applyHook: (velocity, acceleration, anchor, rest_length, k) => {
    const hook = [0, 0, 0];
    glMatrix.vec3.sub(hook, velocity, anchor);
    const distance = glMatrix.vec3.length(hook) - rest_length;
    glMatrix.vec3.normalize(hook, hook);
    glMatrix.vec3.scale(hook, hook, -1 * k * distance);
    glMatrix.vec3.add(acceleration, acceleration, hook);
  }
}
