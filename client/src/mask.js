
import Mask from "./images/half-mask-0.png"
import Glasses from "./images/ar-glasses.webp"

function average(a, b) {
  // force the input as numbers *1
  return ((a*1 + b*1) /2);
}

function drawRotatedImage(ctx, angle){
 
  

  
}

// Drawing function
const draw = (predictions, ctx) => {
    var imgObj = new Image();
    imgObj.src = Glasses

    if (predictions.length > 0) {
        
        for (let i = 0; i < predictions.length; i++) {
          const leftEyeX = predictions[i].landmarks[0][0]
          const leftEyeY = predictions[i].landmarks[0][1]
          const rightEyeX = predictions[i].landmarks[1][0]
          const rightEyeY = predictions[i].landmarks[1][1]
          const x = leftEyeX
          const y = predictions[i].landmarks[1][1];
          const rotation = Math.atan2(rightEyeY - leftEyeY, rightEyeX - leftEyeX )

          const start = predictions[i].topLeft;
          const end = predictions[i].bottomRight;
          const size = [end[0] - start[0], end[1] - start[1]];
          
          ctx.drawImage(imgObj, x - 25, y - 10, size[0] - 50, size[1] - 50)
        }
      }

};


export default draw