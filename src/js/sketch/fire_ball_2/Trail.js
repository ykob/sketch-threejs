import * as THREE from 'three';

const SEGMENT_HEIGHT = 2;
const SEGMENT_COUNT = 10;
const HEIGHT = SEGMENT_HEIGHT * SEGMENT_COUNT;

const applyDrag = (acceleration, value) => {
  const force = acceleration.clone();

  force.multiplyScalar(-1);
  force.normalize();
  force.multiplyScalar(acceleration.length() * value);
  acceleration.add(force);
};
const applyHook = (position, acceleration, anchor, restLength, k) => {
  const force = position.clone().sub(anchor);
  const distance = force.length() - restLength;

  force.normalize();
  force.multiplyScalar(-1 * k * distance);
  acceleration.add(force);
};

export default class Trail extends THREE.SkinnedMesh {
  constructor() {
    const hookes = [];

    // Define Geometry
    const geometry = new THREE.CylinderBufferGeometry(5, 10, HEIGHT, 12, SEGMENT_COUNT * 3, true);
    const { position } = geometry.attributes;
    const vertex = new THREE.Vector3();
    const skinIndices = [];
    const skinWeights = [];
    const bones = [];
    let prevBone = new THREE.Bone();

    for (let i = 0; i < position.count; i ++) {
      vertex.fromBufferAttribute(position, i);
    
      const y = (vertex.y + HEIGHT / 2);
      const skinIndex = Math.floor(y / SEGMENT_HEIGHT);
      const skinWeight = (y % SEGMENT_HEIGHT) / SEGMENT_HEIGHT;
    
      skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
      skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
    }

    for (let j = 0; j <= SEGMENT_COUNT + 1; j++) {
      if (j === 0) {
        prevBone.position.y = HEIGHT / -2;
        bones.push(prevBone);
      } else if (j <= SEGMENT_COUNT) {
        const bone = new THREE.Bone();
        bone.position.y = SEGMENT_HEIGHT;
        bones.push(bone);
        prevBone.add(bone);
        prevBone = bone;
      }

      hookes.push({
        velocity: new THREE.Vector3(),
        acceleration: new THREE.Vector3()
      });
    }
    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));

    // Define Material
    const material = new THREE.MeshPhongMaterial({
      skinning: true,
      color: 0xffffff,
      emissive: 0xffffff,
      wireframe: true,
    });

    // Define Skelton
    const skeleton = new THREE.Skeleton(bones);

    // Create Object3D
    super(geometry, material);
    this.top = new THREE.Vector3(0, 1, 0);
    this.hookes = hookes;
    this.time = 0;
    this.add(bones[0]);
    this.bind(skeleton);

    const pointsGeometry = new THREE.BufferGeometry;
    const baPositions = new THREE.BufferAttribute(new Float32Array(hookes.length * 3), 3);
    pointsGeometry.setAttribute('position', baPositions);
    this.points = new THREE.Points(
      pointsGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        depthTest: false
      })
    )
    this.add(this.points);
  }
  update(time, core) {
    const { bones } = this.skeleton;
    const q1 = new THREE.Quaternion();
    const q2 = new THREE.Quaternion();

    this.time += time;

    for (let i = 0; i < this.hookes.length; i++) {
      const { velocity, acceleration } = this.hookes[i];

      if (i === 0) {
        velocity.copy(core.position);
      } else {
        const anchor = this.hookes[i - 1].velocity;

        applyHook(velocity, acceleration, anchor, 0, 1.2);
        applyDrag(acceleration, 0.7);
        velocity.add(acceleration);
      }
      this.points.geometry.attributes.position.setXYZ(i, velocity.x, velocity.y, velocity.z);
      this.points.geometry.attributes.position.needsUpdate = true;
    }

    for (let i = 0; i < bones.length; i++) {
      const bone = bones[i];
      const { velocity } = this.hookes[i];

      if (i === 0) {
        const nextVelocity = this.hookes[i + 1].velocity;
        const dir = nextVelocity.clone().sub(velocity).normalize();
        const axis = new THREE.Vector3().crossVectors(this.top, dir).normalize();
        const angle = Math.acos(this.top.clone().dot(dir));
        q1.setFromAxisAngle(axis, angle);

        bone.rotation.setFromQuaternion(q1);
      } else {
        const prevVelocity = this.hookes[i - 1].velocity;
        const dir1 = velocity.clone().sub(prevVelocity).normalize();
        const axis1 = new THREE.Vector3().crossVectors(this.top, dir1).normalize();
        const angle1 = Math.acos(this.top.clone().dot(dir1));

        const nextVelocity = this.hookes[i + 1].velocity;
        const dir2 = nextVelocity.clone().sub(velocity).normalize();
        const axis2 = new THREE.Vector3().crossVectors(this.top, dir2).normalize();
        const angle2 = Math.acos(this.top.clone().dot(dir2));

        q1.setFromAxisAngle(axis1, angle1);
        q2.setFromAxisAngle(axis2, angle2);
        q1.conjugate().multiply(q2);
        bone.rotation.setFromQuaternion(q1);
      }
      if (i === 0) {
        bone.position.copy(core.position);
      } else {
        const prevVelocity = this.hookes[i - 1].velocity;

        bone.position.y = velocity.distanceTo(prevVelocity);
      }
    }
  }
}