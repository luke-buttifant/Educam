
import Mask from "./images/half-mask-0.png"

// Drawing function
const draw = (predictions, ctx) => {
    var imgObj = new Image();
    imgObj.src = Mask

    if (predictions.length > 0) {
        
        for (let i = 0; i < predictions.length; i++) {
          const start = predictions[i].landmarks[2];
          const end = predictions[i].landmarks[3];
          const size = [end[0] - start[0], end[1] - start[1]];
          
    
          // Render a rectangle over each detected face.
          
          ctx.drawImage(imgObj, start[0] - 50, start[1] - 20, size[0] + 100, size[1] + 70)
        //   ctx.beginPath();
        //   ctx.lineWidth = "6";
        //   ctx.strokeStyle = "#8472FC";
        //   ctx.rect(start[0], start[1], size[0], size[1]);
        //   ctx.stroke();
        }
      }

};

export default draw