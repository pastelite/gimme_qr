import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as QRCode from 'qrcode'
import drawQR, { DrawQRConfig } from './lib/drawer'
import { useQRCodeStore, useMeasurementStore } from './store'
import { Scaffold } from './components/Scaffold'
import { themeConfig, themeBreakpoints } from './tailwind-theme'
import { Header } from './components/Header'
import { BackgroundSurface, BehindBackgroundSurface } from './components/Surface'


function OptionSelector() {
  return (<div className='grid grid-flow-row'>
    <div className='bg-black/10 w-24 h-24 p-2 rounded-xl'>
      <div>Test</div>
      <div>
        Selector
      </div>
    </div>
  </div>);
}


function QRInput() {
  const [config, setConfig, inputText, setInputText] = useQRCodeStore((state) => [state.config, state.setConfig, state.inputText, state.setInputText])

  function valueChangeHandlerGenerator(name: keyof DrawQRConfig) {

    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setConfig({
        ...config,
        [name]: e.target.value as any,
      })
    }
  }

  return (<BackgroundSurface gridArea='above' className='
  flex items-left justify-start md:justify-center flex-col gap-4
  h-full p-5 md:p-12 lg:p-24'>
    <input type="text" className='text-3xl border-b-2 py-1 border-black w-full outline-none' placeholder='https://qr.pstl.dev/' onChange={e => {
      setInputText(e.target.value);
    }}></input>

    <div id="config">
      Config
      <select name="shape" id="shape" onChange={valueChangeHandlerGenerator("shape")}>
        <option value="circle">circle</option>
        <option value="square">square</option>
      </select>
    </div>
    <OptionSelector></OptionSelector>
  </BackgroundSurface>);
}

interface PopUpProps {
  components?: {[key: string]: React.ReactNode}
}

function PopUp() {
  return <div className='bg-white mx-8 p-[50px] fixed bottom-0 left-0 right-0 rounded-t-[1.5rem] shadow-[0_2px_16px_rgba(0,0,0,0.25)]'>
    test
  </div>
}

// import { Scaffold } from './components/Scaffold.1'

function App() {
  // const [inputText, setInputText] = useState<string>('test')
  const [config, setConfig, inputText, setInputText] = useQRCodeStore((state) => [state.config, state.setConfig, state.inputText, state.setInputText])
  const [breakpoint, setBreakpoint] = useMeasurementStore((state) => [state.breakpoint, state.setBreakpoint])

  useEffect(() => {
    console.log(breakpoint)
  }, [breakpoint])

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

  return (
    <>
      <Scaffold>
        <PopUp/>
        <Header />
        <QRInput></QRInput>
        <BehindBackgroundSurface gridArea='under'>
          <div id="qr" className='flex items-center justify-center flex-col h-full'>
            <canvas id="canvas" ref={canvas} className='w-[150px] h-[150px]'></canvas>
            <button onClick={handleDownload}>Download</button>
          </div>
        </BehindBackgroundSurface>
      </Scaffold>
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
