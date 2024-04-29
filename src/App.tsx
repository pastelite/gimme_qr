import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as QRCode from 'qrcode'
import drawQR, { DrawQRConfig } from './lib/drawer'
import { useQRCodeStore, useMeasurementStore } from './store'
import { Scaffold } from './components/Scaffold'
import { themeConfig, themeBreakpoints } from './tailwind-theme'
// import { Scaffold } from './components/Scaffold.1'

function App() {
  const [inputText, setInputText] = useState<string>('test')
  const [config, setConfig] = useQRCodeStore((state) => [state.config, state.setConfig])
  const [breakpoint, setBreakpoint] = useMeasurementStore((state) => [state.breakpoint, state.setBreakpoint])

  useEffect(() => {
    console.log(breakpoint)
  },[breakpoint])

  useEffect(() => {
    // shitty breakpoint detection. It works, but it's not the best way to do it.
    const handleResize = () => {
      let prevValue = 0
      let setBreakpointBeforeLoopEnd = false
      for (const value of Object.values(themeBreakpoints)) {
        if (window.innerWidth <= value) {
          setBreakpoint(prevValue as any)
          setBreakpointBeforeLoopEnd = true
          break
        }
        prevValue = value
      }
      if (!setBreakpointBeforeLoopEnd) {
        setBreakpoint(prevValue as any)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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
      <Scaffold
        above={
          <div id="input">
            Input:
            <input type="text" onChange={(e) => {
              setInputText(e.target.value)
            }}></input>
          </div>
        }
        below={
          <div id="config">
            Config
            <select name="shape" id="shape" onChange={valueChangeHandlerGenerator("shape")}>
              <option value="circle">circle</option>
              <option value="square">square</option>
            </select>
          </div>
        }
      />
      {/* <div id="container">
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
      </div> */}
    </>
  )
}

export interface LayoutManagerProps {
  above?: React.ReactNode
  below?: React.ReactNode
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
