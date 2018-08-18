export default function() {
  const search = decodeURIComponent(location.search.substring(1));
  const searchArr = search.split('&');
  for (var i = 0; i < searchArr.length; i++) {
    if (searchArr[i].indexOf('sketch_id') < 0) continue;
    let id = searchArr[i].replace('sketch_id=', '');
    id = parseInt(id, 10);
    switch (id) {
      case 9: location.href = '/sketch-threejs/sketch/attract.html'; break;
      case 8: location.href = '/sketch-threejs/sketch/hole.html'; break;
      case 7: location.href = '/sketch-threejs/sketch/metal_cube.html'; break;
      case 6: location.href = '/sketch-threejs/sketch/distort.html'; break;
      case 5: location.href = '/sketch-threejs/sketch/image_data.html'; break;
      case 4: location.href = '/sketch-threejs/sketch/gallery.html'; break;
      case 3: location.href = '/sketch-threejs/sketch/comet.html'; break;
      case 2: location.href = '/sketch-threejs/sketch/hyper_space.html'; break;
      case 1: location.href = '/sketch-threejs/sketch/fire_ball.html'; break;
      default:
    }
  }
}
