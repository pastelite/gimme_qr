import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as QRCode from 'qrcode'

function App() {
  const [inputText, setInputText] = useState<string>('test')
  const [output, setOutput] = useState<string>('')
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    genQRCode(inputText).then((res) => {
      if (!res) return
      setOutput(JSON.stringify(res.modules.data))
      drawQR(res.modules.data, canvas.current!, {color:"red", shape:"circle"})
    })
  }, [inputText])

  return (
    <>
    <h1>Gimme QR</h1>
    <div className="Input">
      <input type="text" onChange={(e)=>{
       setInputText(e.target.value)
      }}></input>
    </div>
    <div>
      Output
      {output}
      <canvas id="canvas" ref={canvas}></canvas>
    </div>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

async function genQRCode(text: string) {
  try {
    const res = await QRCode.create(text)
    console.log(res.modules.data)
    return res
  } catch (err) {
    console.error(err)
  }
}

type DrawQRConfig = {
  color: string
  shape: string
}

function drawQR(data: Uint8Array, canvas: HTMLCanvasElement, config?: DrawQRConfig) {
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return

  const width = Math.sqrt(data.length)

  const size = 10

  canvas.width = width * size
  canvas.height = width * size

  for (let i = 0; i < data.length; i++) {
    const row = Math.floor(i / width)
    const col = i % width
    ctx.fillStyle = data[i] ? (config?.color || '#000') : '#fff'
    if (config?.shape == "circle") {
      let startCol = col * size //x
      let startRow = row * size //y

      ctx.beginPath();
      ctx.moveTo(startCol, startRow+size/2);

      let arc = [0, 0, 1, 0]
      // TL, TR, BR, BL

      // TL
      let stop1 = [startCol, startRow]
      let stop2 = [startCol+size/2, startRow]

      function drawCorner(ctx: CanvasRenderingContext2D, stop1: number[], stop2: number[], arc: number) {
        if (arc == 1) {
          ctx.arcTo(stop1[0], stop1[1], stop2[0], stop2[1], size/2);
        } else {
          ctx.lineTo(stop1[0], stop1[1]);
          ctx.lineTo(stop2[0], stop2[1]);
        }
      }

      drawCorner(ctx, stop1, stop2, arc[0])

      // TR
      stop1 = [startCol+size, startRow]
      stop2 = [startCol+size, startRow+size/2]

      drawCorner(ctx, stop1, stop2, arc[1])

      // BR
      stop1 = [startCol+size, startRow+size]
      stop2 = [startCol+size/2, startRow+size]

      drawCorner(ctx, stop1, stop2, arc[2])

      // BL
      stop1 = [startCol, startRow+size]
      stop2 = [startCol, startRow+size/2]

      drawCorner(ctx, stop1, stop2, arc[3])



      
      ctx.fill();
    } else {
      ctx.fillRect(col * size, row * size, size, size)
    }
  }
}

export default App
