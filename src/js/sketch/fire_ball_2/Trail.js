import * as THREE from 'three';

const SEGMENT_HEIGHT = 2;
const SEGMENT_COUNT = 10;
const HEIGHT = SEGMENT_HEIGHT * SEGMENT_COUNT;

export default class Trail extends THREE.SkinnedMesh {
  constructor() {
    // Define Geometry
    const geometry = new THREE.CylinderBufferGeometry(5, 5, HEIGHT, 8, SEGMENT_COUNT * 3, true);
    const { position } = geometry.attributes;
    const vertex = new THREE.Vector3();
    const skinIndices = [];
    const skinWeights = [];
    const bones = [];
    let prevBone = new THREE.Bone();

    bones.push(prevBone);
    prevBone.position.y = HEIGHT / -2;
    for ( let i = 0; i < position.count; i ++ ) {
      vertex.fromBufferAttribute( position, i );
    
      const y = (vertex.y + HEIGHT / 2);
      const skinIndex = Math.floor(y / SEGMENT_HEIGHT);
      const skinWeight = (y % SEGMENT_HEIGHT) / SEGMENT_HEIGHT;
    
      skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
      skinWeights.push(1 - skinWeight, skinWeight, 0, 0);

      const bone = new THREE.Bone();
      bone.position.y = SEGMENT_HEIGHT;
      bones.push(bone);
      prevBone.add(bone);
      prevBone = bone;
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

    // Create Object3D
    super(geometry, material);
    this.add(bones[0]);
    this.time = 0;

    const skeleton = new THREE.Skeleton(bones);

    this.bind(skeleton);
  }
  update(time) {
    this.time += time;
    for (let i = 0; i < this.skeleton.bones.length; i++) {
      this.skeleton.bones[i].rotation.z = Math.sin(this.time) * 10 / this.skeleton.bones.length;
    }
  }
}