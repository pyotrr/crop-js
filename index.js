const imageElement = new Image()
const canvasElement = document.getElementById('photoCanvas');

let canvasBoundingBox;

const getFile = (e) => {
  const photo = e.target.files[0];
  const fr = new FileReader()
  fr.readAsDataURL(photo)
  fr.addEventListener('load', () => {
    imageElement.src = fr.result;
  })
}

imageElement.addEventListener('load', () => {
  canvasElement.width = 500
  canvasElement.height = 500
  const canvasContext = canvasElement.getContext('2d', {alpha: false})

  const scale = Math.min(
    canvasElement.width / imageElement.width,
    canvasElement.height / imageElement.height
  )
  const startX = Math.floor(
    canvasElement.width / 2 - (imageElement.width / 2) * scale
  );
  const startY = Math.floor(
    canvasElement.height / 2 - (imageElement.height / 2) * scale
  );

  canvasContext.drawImage(
    imageElement,
    startX,
    startY,
    Math.floor(imageElement.width * scale),
    Math.floor(imageElement.height * scale)
  )
  canvasBoundingBox = canvasElement.getBoundingClientRect();
  cropElement.style.top = '10px';
  cropElement.style.left = '10px';
  cropElement.classList.remove('hidden');
})


document.getElementById('fileInput').addEventListener('change', getFile);


let isHoldingMouseOnCropElement = false
let mouseOffsetX = 0;
let mouseOffsetY = 0;
let isMouseDownOnBotRight = false;
let isMouseDownOnTopRight = false;
let isMouseDownOnBotLeft = false;
let isMouseDownOnTopLeft = false;


const cropElement = document.getElementById('cropElement');

cropElement.addEventListener('mousedown', (e) => {
  isHoldingMouseOnCropElement = true;
  mouseOffsetX = e.offsetX
  mouseOffsetY = e.offsetY
})
cropElement.addEventListener('mouseup', () => {
  isHoldingMouseOnCropElement = false;
})
cropElement.addEventListener('mouseleave', () => {
  if (isHoldingMouseOnCropElement) {
    isHoldingMouseOnCropElement = false;
  }
})
cropElement.addEventListener('mousemove', (e) => {
  if (!isHoldingMouseOnCropElement
    || isMouseDownOnBotRight
    || isMouseDownOnTopRight
    || isMouseDownOnTopLeft
    || isMouseDownOnBotLeft) return;
  let x = e.clientX - canvasBoundingBox.left - mouseOffsetX
  if (x < 0) {
    x = 0
  } else if (x > canvasBoundingBox.width - cropElement.offsetWidth) {
    x = canvasBoundingBox.width - cropElement.offsetWidth
  }
  let y = e.clientY - canvasBoundingBox.top - mouseOffsetY
  if (y < 0) {
    y = 0
  } else if (y > canvasBoundingBox.height - cropElement.offsetHeight) {
    y = canvasBoundingBox.height - cropElement.offsetHeight
  }
  cropElement.style.top = `${y}px`
  cropElement.style.left = `${x}px`
})

const br = document.getElementById('br')
br.addEventListener('mousedown', () => {
  isHoldingMouseOnCropElement = false;
  isMouseDownOnBotRight = true;
  br.style.padding = '15px'
})
br.addEventListener('mouseup', () => {
  isMouseDownOnBotRight = false;
  br.style.padding = '5px'
})
br.addEventListener('mouseleave', () => {
  isMouseDownOnBotRight = false;
  br.style.padding = '5px'
})
br.addEventListener('mousemove', (e) => {
  if (!isMouseDownOnBotRight) return;
  const cropElementBoundingBox = cropElement.getBoundingClientRect()
  const x = cropElementBoundingBox.width + (e.clientX - cropElementBoundingBox.right)
  const y = cropElementBoundingBox.height + (e.clientY - cropElementBoundingBox.bottom)

  cropElement.style.width = `${x}px`;
  cropElement.style.height = `${y}px`;
})

const tr = document.getElementById('tr')
tr.addEventListener('mousedown', () => {
  isHoldingMouseOnCropElement = false;
  isMouseDownOnTopRight = true;
  br.style.padding = '15px'
})
tr.addEventListener('mouseup', () => {
  isMouseDownOnTopRight = false;
  tr.style.padding = '5px'
})
tr.addEventListener('mouseleave', () => {
  isMouseDownOnTopRight = false;
  tr.style.padding = '5px'
})
tr.addEventListener('mousemove', (e) => {
  if (!isMouseDownOnTopRight) return;
  const cropElementBoundingBox = cropElement.getBoundingClientRect()
  const x = cropElementBoundingBox.width + (e.clientX - cropElementBoundingBox.right)

  const heightDiff = e.clientY - cropElementBoundingBox.top
  const topRelativeToCanvas = cropElementBoundingBox.top - canvasBoundingBox.top;
  const h = cropElement.style.height.match(/\d/g)?.join('') || cropElementBoundingBox.height;

  cropElement.style.height = `${h - heightDiff}px`
  cropElement.style.top = `${topRelativeToCanvas + heightDiff}px`
  cropElement.style.width = `${x}px`;
})

const bl = document.getElementById('bl')
bl.addEventListener('mousedown', () => {
  isHoldingMouseOnCropElement = false;
  isMouseDownOnBotLeft = true;
  bl.style.padding = '15px'
})
bl.addEventListener('mouseup', () => {
  isMouseDownOnBotLeft = false;
  bl.style.padding = '5px'
})
bl.addEventListener('mouseleave', () => {
  isMouseDownOnBotLeft = false;
  bl.style.padding = '5px'
})
bl.addEventListener('mousemove', (e) => {
  if (!isMouseDownOnBotLeft) return;
  const cropElementBoundingBox = cropElement.getBoundingClientRect();
  const y = cropElementBoundingBox.height + (e.clientY - cropElementBoundingBox.bottom);

  const widthDiff = e.clientX - cropElementBoundingBox.left;
  const leftRelativeToCanvas = cropElementBoundingBox.left - canvasBoundingBox.left;
  const w = cropElement.style.width.match(/\d/g)?.join('') || cropElementBoundingBox.width;

  cropElement.style.height = `${y}px`
  cropElement.style.left = `${leftRelativeToCanvas + widthDiff}px`;
  cropElement.style.width = `${w - widthDiff}px`
})

const tl = document.getElementById('tl')
tl.addEventListener('mousedown', () => {
  isHoldingMouseOnCropElement = false;
  isMouseDownOnTopLeft = true;
  tl.style.padding = '15px'
})
tl.addEventListener('mouseup', () => {
  isMouseDownOnTopLeft = false;
  tl.style.padding = '5px'
})
tl.addEventListener('mouseleave', () => {
  isMouseDownOnTopLeft = false;
  tl.style.padding = '5px'
})
tl.addEventListener('mousemove', (e) => {
  if (!isMouseDownOnTopLeft) return;
  const cropElementBoundingBox = cropElement.getBoundingClientRect();

  const heightDiff = e.clientY - cropElementBoundingBox.top
  const topRelativeToCanvas = cropElementBoundingBox.top - canvasBoundingBox.top;
  const h = cropElement.style.height.match(/\d/g)?.join('') || cropElementBoundingBox.height;

  const widthDiff = e.clientX - cropElementBoundingBox.left;
  const leftRelativeToCanvas = cropElementBoundingBox.left - canvasBoundingBox.left;
  const w = cropElement.style.width.match(/\d/g)?.join('') || cropElementBoundingBox.width;

  cropElement.style.height = `${h - heightDiff}px`;
  cropElement.style.top = `${topRelativeToCanvas + heightDiff}px`;
  cropElement.style.left = `${leftRelativeToCanvas + widthDiff}px`;
  cropElement.style.width = `${w - widthDiff}px`;
})


const cropPic = () => {
  const finalImageDimensions = cropElement.getBoundingClientRect();
  const croppedCanvas = document.createElement('canvas');
  const croppedCanvasContext = croppedCanvas.getContext('2d');
  croppedCanvas.width = finalImageDimensions.width;
  croppedCanvas.height = finalImageDimensions.height;

  const topRelativeToCanvas = finalImageDimensions.top - canvasBoundingBox.top;
  const leftRelativeToCanvas = finalImageDimensions.left - canvasBoundingBox.left;

  croppedCanvasContext.drawImage(
    canvasElement,
    leftRelativeToCanvas,
    topRelativeToCanvas,
    finalImageDimensions.width,
    finalImageDimensions.height,
    0,
    0,
    croppedCanvas.width,
    croppedCanvas.height
  );

  const imageUrl = croppedCanvas.toDataURL('image/jpeg');
  const linkElement = document.createElement('a');
  linkElement.download = 'cropped_picture.jpg';
  linkElement.href = imageUrl;
  linkElement.click();
}

document.getElementById('downloadCropped')
  .addEventListener('click', cropPic)
