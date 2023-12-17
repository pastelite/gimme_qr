import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as QRCode from 'qrcode'
import drawQR from './lib/drawer'

function App() {
  const [inputText, setInputText] = useState<string>('test')
  const [output, setOutput] = useState<string>('')
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    genQRCode(inputText).then((res) => {
      if (!res) return
      setOutput(JSON.stringify(res.modules.data))
      drawQR(res.modules.data, canvas.current!, {color:"black", shape:"circle"})
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

export default App
