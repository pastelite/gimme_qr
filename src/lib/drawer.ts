type DrawQRConfig = {
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
  canvas.width = width * config.pixelSize!
  canvas.height = width * config.pixelSize!

  for (let i = 0; i < data.length; i++) {
    if (config?.shape == "circle") drawCircle(ctx, data, i, width, config)
    else drawSquare(ctx, data, i, width, config)
  }
}

function drawSquare(ctx: CanvasRenderingContext2D, data: Uint8Array, i: number, size: number, config: DrawQRConfig) {
  // get row and col
  const row = Math.floor(i / size)
  const col = i % size

  // draw
  ctx.fillStyle = data[i] ? (config?.color || '#000') : '#fff'
  ctx.fillRect(col * config?.pixelSize, row * config?.pixelSize, config?.pixelSize, config?.pixelSize)
}

function drawCircle(ctx: CanvasRenderingContext2D, data: Uint8Array, i: number, size: number, config: DrawQRConfig) {
  // get row and col
  const row = Math.floor(i / size)
  const col = i % size
  const startCol = col * config.pixelSize //x
  const startRow = row * config.pixelSize //y

  ctx.fillStyle = (config?.color || '#000')

  // If white, fill everything first, then draw white on top
  if (data[i] == 0) {
    ctx.beginPath();
    ctx.rect(startCol, startRow, config.pixelSize!, config.pixelSize!)
    ctx.fill();
    ctx.fillStyle = '#fff'
  }

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

  function drawCorner(ctx: CanvasRenderingContext2D, stop1: number[], stop2: number[], arc: number) {
    if (arc == 1) {
      ctx.arcTo(stop1[0], stop1[1], stop2[0], stop2[1], config.pixelSize! / 2);
    } else {
      ctx.lineTo(stop1[0], stop1[1]);
      ctx.lineTo(stop2[0], stop2[1]);
    }
  }

  // == Draw corner ==
  // o > o > o
  // ^       v
  // x       o // x is the start
  // ^       v
  // o < o < o

  // TL
  let stop1 = [startCol, startRow]
  let stop2 = [startCol + config.pixelSize / 2, startRow]
  drawCorner(ctx, stop1, stop2, isArc[0])

  // TR
  stop1 = [startCol + config.pixelSize, startRow]
  stop2 = [startCol + config.pixelSize, startRow + config.pixelSize / 2]
  drawCorner(ctx, stop1, stop2, isArc[1])

  // BR
  stop1 = [startCol + config.pixelSize, startRow + config.pixelSize]
  stop2 = [startCol + config.pixelSize / 2, startRow + config.pixelSize]
  drawCorner(ctx, stop1, stop2, isArc[2])

  // BL
  stop1 = [startCol, startRow + config.pixelSize]
  stop2 = [startCol, startRow + config.pixelSize / 2]
  drawCorner(ctx, stop1, stop2, isArc[3])

  ctx.fill();
}