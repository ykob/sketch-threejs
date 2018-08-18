export default function(imgs, callback) {
  const length = Object.keys(imgs).length;
  const loadedImgs = {};
  let count = 0;

  for (var key in imgs) {
    const k = key;
    if (imgs.hasOwnProperty(k)) {
      const img = new Image();
      img.onload = () => {
        loadedImgs[k] = img;
        count++;
        if (count >= length) callback(loadedImgs);
      };
      img.onerror = () => {
        console.error(`Failed to load image in loadImage function.`)
        count++;
        if (count >= length) callback(loadedImgs);
      };
      img.src = imgs[k];
    }
  }
}
