export default function(vector) {
  vector.x = (vector.x / document.body.clientWidth) * 2 - 1;
  vector.y = - (vector.y / window.innerHeight) * 2 + 1;
};
