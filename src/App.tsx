import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as QRCode from 'qrcode'
import drawQR, { DrawQRConfig } from './lib/drawer'
import { useQRCodeStore } from './store'

function App() {
  const [inputText, setInputText] = useState<string>('test')
  const [config, setConfig] = useQRCodeStore((state) => [state.config, state.setConfig])
  // const [config, setConfig] = useState<DrawQRConfig>({
  //   color: 'black',
  //   shape: 'circle',
  //   pixelSize: 0, //unusued
  // })
  // const [shape, setShape] = useQRCodeStore((state) => [state.shape, state.setShape])
  // const [color, setColor] = useQRCodeStore((state) => [state.color, state.setColor])

  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    genQRCode(inputText).then((res) => {
      if (!res) return

      drawQR(res.modules.data, canvas.current!, config)
    })
  }, [inputText, config])

  function handleDownload() {
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.current!.toDataURL()
    link.click()
  }

  function valueChangeHandlerGenerator(name: keyof DrawQRConfig) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setConfig({
        ...config,
        [name]: e.target.value as any,
      })
    }
  }

  return (
    <>
      <div id="container">
        <div id="input">
          Input:
          <input type="text" onChange={(e) => {
            setInputText(e.target.value)
          }}></input>
        </div>
        <div id="config">
          Config
          <select name="shape" id="shape" onChange={valueChangeHandlerGenerator("shape")}>
            <option value="circle">circle</option>
            <option value="square">square</option>
          </select>
        </div>
      </div>
      <div id="qr">
        <canvas id="canvas" ref={canvas}></canvas>
        <button onClick={handleDownload}>Download</button>
      </div>
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
