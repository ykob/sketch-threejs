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
    const geometry = new THREE.CylinderBufferGeometry(5, 5, HEIGHT, 8, SEGMENT_COUNT * 3, true);
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

    for (let j = 0; j < SEGMENT_COUNT + 1; j++) {
      if (j === 0) {
        prevBone.position.y = HEIGHT / -2;
        bones.push(prevBone);
      } else {
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
      color: 0x156289,
      emissive: 0x072534,
      side: THREE.DoubleSide,
      flatShading: true
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
  }
  update(time, core) {
    const { bones } = this.skeleton;

    this.time += time;

    for (let i = 0; i < this.hookes.length; i++) {
      const { velocity, acceleration } = this.hookes[i];

      if (i === 0) {
        velocity.copy(core.position);
      } else {
        const anchor = this.hookes[i - 1].velocity;

        applyHook(velocity, acceleration, anchor, 1, 1.1);
        applyDrag(acceleration, 0.7);
        velocity.add(acceleration);
      }
    }

    for (let i = 0; i < bones.length; i++) {
      const bone = bones[i];
      const { velocity } = this.hookes[i];

      // if (i < bones.length - 1) {
      if (i === 0) {
        const nextVelocity = this.hookes[i + 1].velocity;
        const dir = nextVelocity.clone().sub(velocity).normalize();
        const axis = new THREE.Vector3().crossVectors(this.top, dir);
        const angle = Math.acos(dir.clone().dot(this.top));
        const rotateMat = new THREE.Matrix4().makeRotationAxis(axis, angle);

        bone.rotation.setFromRotationMatrix(rotateMat);
      } else if (i < bones.length - 1) {
        const prevVelocity = this.hookes[i - 1].velocity;
        const nextVelocity = this.hookes[i + 1].velocity;
        const dir1 = nextVelocity.clone().sub(velocity).normalize();
        const dir2 = velocity.clone().sub(prevVelocity).normalize();
        const dir = dir1.sub(dir2).normalize();
        const axis = new THREE.Vector3().crossVectors(this.top, dir);
        const angle = Math.acos(dir.clone().dot(this.top));
        const rotateMat = new THREE.Matrix4().makeRotationAxis(axis, angle);

        bone.rotation.setFromRotationMatrix(rotateMat);
      }
      if (i === 0) {
        bone.position.copy(core.position);
      } else {
        const prevBone = bones[i - 1];
        const prevVelocity = this.hookes[i - 1].velocity;

        bone.position.y = velocity.distanceTo(prevVelocity);
      }
    }
  }
}