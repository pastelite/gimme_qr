import { useEffect, useRef } from "react"
import { useQRCodeStore } from "../store"
import drawQR from "../lib/drawer"
import * as QRCode from 'qrcode'
import { BehindBackgroundSurface } from "../components/Surface"

export default function QRResult() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [config, inputText] = useQRCodeStore((state) => [state.config, state.inputText])

  useEffect(() => {
    genQRCode(inputText).then((res) => {
      if (!res) return

      drawQR(res.modules.data, canvas.current!, config)
    })
  }, [inputText, config])

  async function genQRCode(text: string) {
    try {
      const res = await QRCode.create(text)
      // console.log(res.modules.data)
      return res
    } catch (err) {
      console.error(err)
    }
  }

  function handleDownload() {
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.current!.toDataURL()
    link.click()
  }

  return (<BehindBackgroundSurface gridArea='under'>
    <div id="qr" className='flex items-center justify-center flex-col h-full'>
      <canvas id="canvas" ref={canvas} className='w-[150px] h-[150px]'></canvas>
      <button onClick={handleDownload}>Download</button>
    </div>
  </BehindBackgroundSurface>);
}