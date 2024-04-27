export type DrawQRConfig = {
  color: string
  shape: string
  pixelSize: number
}

function fillConfig(config?: Partial<DrawQRConfig>): DrawQRConfig {
  const defaultConfig: DrawQRConfig = {
    color: '#000',
    shape: 'square',
    pixelSize: 10
  }

  return { ...defaultConfig, ...config }
}

export default function drawQR(data: Uint8Array, canvas: HTMLCanvasElement, configs?: Partial<DrawQRConfig>) {
  let config = fillConfig(configs)

  const ctx = canvas.getContext('2d')
  
  
  if (!ctx) return

  const width = Math.sqrt(data.length)
  const desiredCanvasSize = 2000
  config.pixelSize = Math.floor(desiredCanvasSize / width)
  canvas.width = width * config.pixelSize!
  canvas.height = width * config.pixelSize!

 

  ctx.fillStyle = 'red';

  for (let i = 0; i < data.length; i++) {
    if (config?.shape == "circle") drawBlob(ctx, data, i, width, config)
    else drawSquare(ctx, data, i, width, config)
  }
}

function drawSquare(ctx: CanvasRenderingContext2D, data: Uint8Array, i: number, size: number, config: DrawQRConfig) {
  // get row and col
  const row = Math.floor(i / size)
  const col = i % size

  const grd = ctx.createLinearGradient(0, 0, size*config.pixelSize, 0);
  grd.addColorStop(0, "red");
  grd.addColorStop(1, "blue");


  // draw
  ctx.fillStyle = data[i] ?  grd : '#fff'
  // ctx.fillStyle = 'blue'
  // test

  ctx.fillRect(col * config?.pixelSize, row * config?.pixelSize, config?.pixelSize, config?.pixelSize)
}

function drawBlob(ctx: CanvasRenderingContext2D, data: Uint8Array, i: number, size: number, config: DrawQRConfig) {
  // get row and col
  const row = Math.floor(i / size)
  const col = i % size
  const startCol = col * config.pixelSize //x
  const startRow = row * config.pixelSize //y

  ctx.fillStyle = (config?.color || '#000')

  // if (data[i] == 0) ctx.fillStyle = '#00f'

  ctx.beginPath();
  ctx.moveTo(startCol, startRow + config.pixelSize / 2);

  // == Get empty sides ==
  let emptySide = [0, 0, 0, 0] // T, R, B, L

  // Top
  if (row == 0) emptySide[0] = 1
  else if (data[i - size] == 0) emptySide[0] = 1

  // Right
  if (col == size - 1) emptySide[1] = 1
  else if (data[i + 1] == 0) emptySide[1] = 1

  // Bottom
  if (row == size - 1) emptySide[2] = 1
  else if (data[i + size] == 0) emptySide[2] = 1

  // Left
  if (col == 0) emptySide[3] = 1
  else if (data[i - 1] == 0) emptySide[3] = 1

  // == Get isArc ==
  let isArc = [0, 0, 0, 0] // TL, TR, BR, BL

  if (data[i] == 1) {
    if (emptySide[3] && emptySide[0]) isArc[0] = 1
    if (emptySide[0] && emptySide[1]) isArc[1] = 1
    if (emptySide[1] && emptySide[2]) isArc[2] = 1
    if (emptySide[2] && emptySide[3]) isArc[3] = 1
  } else if (data[i] == 0) {
    // for white, check corners and surrounding

    if (data[i - size - 1] == 1 && !emptySide[3] && !emptySide[0]) isArc[0] = 1
    if (data[i - size + 1] == 1 && !emptySide[0] && !emptySide[1]) isArc[1] = 1
    if (data[i + size + 1] == 1 && !emptySide[1] && !emptySide[2]) isArc[2] = 1
    if (data[i + size - 1] == 1 && !emptySide[2] && !emptySide[3]) isArc[3] = 1
  }

  for (let corner of [Corner.TOP_LEFT, Corner.TOP_RIGHT, Corner.BOTTOM_RIGHT, Corner.BOTTOM_LEFT]) {

    let cornerType = isArc[corner] ? BlobCornerType.ARC : BlobCornerType.LINE
    if (data[i] == 0) {
      cornerType = isArc[corner] ? BlobCornerType.REVERSE_ARC : BlobCornerType.NONE
    }
    drawBlobCorner(ctx, corner, cornerType, startCol, startRow, config)
  }

  ctx.fill();
}

enum Corner {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT,
  BOTTOM_LEFT
}

function getPoints(corner: Corner, startCol: number, startRow: number, config: DrawQRConfig) {
  let point = {
    before: [0, 0],
    corner: [0, 0],
    after: [0, 0]
  }
  switch (corner) {
    case Corner.TOP_LEFT:
      point.before = [startCol, startRow + config.pixelSize / 2]
      point.corner = [startCol, startRow]
      point.after = [startCol + config.pixelSize / 2, startRow]
      break;
    case Corner.TOP_RIGHT:
      point.before = [startCol + config.pixelSize / 2, startRow]
      point.corner = [startCol + config.pixelSize, startRow]
      point.after = [startCol + config.pixelSize, startRow + config.pixelSize / 2]
      break;
    case Corner.BOTTOM_RIGHT:
      point.before = [startCol + config.pixelSize, startRow + config.pixelSize / 2]
      point.corner = [startCol + config.pixelSize, startRow + config.pixelSize]
      point.after = [startCol + config.pixelSize / 2, startRow + config.pixelSize]
      break;
    case Corner.BOTTOM_LEFT:
      point.before = [startCol + config.pixelSize / 2, startRow + config.pixelSize]
      point.corner = [startCol, startRow + config.pixelSize]
      point.after = [startCol, startRow + config.pixelSize / 2]
      break;
  }

  return point
}

enum BlobCornerType {
  ARC,
  REVERSE_ARC,
  LINE,
  NONE
}

function drawBlobCorner(
  ctx: CanvasRenderingContext2D,
  corner: Corner,
  cornerType: BlobCornerType,
  startCol: number,
  startRow: number,
  config: DrawQRConfig
) {
  let { before, corner: cornerPoint, after } = getPoints(corner, startCol, startRow, config)
  let center = [startCol + config.pixelSize / 2, startRow + config.pixelSize / 2]

  switch (cornerType) {
    case (BlobCornerType.LINE):
      ctx.lineTo(before[0], before[1])
      ctx.lineTo(cornerPoint[0], cornerPoint[1]);
      ctx.lineTo(after[0], after[1]);
      break;
    case (BlobCornerType.ARC):
      ctx.lineTo(before[0], before[1])
      ctx.arcTo(cornerPoint[0], cornerPoint[1], after[0], after[1], config.pixelSize! / 2);
      break;
    case (BlobCornerType.REVERSE_ARC):
      ctx.moveTo(cornerPoint[0], cornerPoint[1])
      ctx.lineTo(before[0], before[1]);
      ctx.arcTo(cornerPoint[0], cornerPoint[1], after[0], after[1], config.pixelSize / 2);
      ctx.lineTo(cornerPoint[0], cornerPoint[1])
      break;
    case (BlobCornerType.NONE):
      ctx.moveTo(before[0], before[1])
      ctx.moveTo(after[0], after[1])
  }
}