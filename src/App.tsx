import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as QRCode from 'qrcode'
import drawQR from './lib/drawer'
import { useQRCodeStore, useMeasurementStore } from './store'
import { Scaffold } from './components/Scaffold'
import { themeConfig, themeBreakpoints } from './tailwind-theme'
import { Header } from './components/Header'
import { BehindBackgroundSurface } from './components/Surface'
import { QRInput } from './pages/QRInput'
import { CustomizedPopUp } from './pages/CustomizedPopUp'
import QRResult from './pages/QRResult'


// import { Scaffold } from './components/Scaffold.1'

function App() {
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

  return (
    <>
      <Scaffold>
        <CustomizedPopUp />
        <Header />
        <QRInput></QRInput>
        <QRResult></QRResult>
      </Scaffold>
    </>
  )
}

export default App
