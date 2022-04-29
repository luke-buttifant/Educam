
import Mask from "./images/half-mask-0.png"
import Glasses from "./images/ar-glasses.webp"

function average(a, b) {
  // force the input as numbers *1
  return ((a*1 + b*1) /2);
}

// Drawing function
const viewerDraw = (x, y, size, ctx) => {
    var imgObj = new Image();
    imgObj.src = Glasses
    ctx.drawImage(imgObj, x - 25, y - 10, size[0] - 50, size[1] - 50)
};


export default viewerDraw