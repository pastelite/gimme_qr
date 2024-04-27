import { create } from 'zustand'
import { DrawQRConfig } from './lib/drawer'

enum Shape {
  Circle = 'circle',
  Square = 'square',
}

interface QRCodeStore {
  inputText: string
  config: DrawQRConfig
  setInputText: (inputText: string) => void
  setConfig: (config: DrawQRConfig) => void
}

export const useQRCodeStore = create<QRCodeStore>((set) => ({
  inputText: '',
  config: {
    color: 'black',
    shape: Shape.Circle,
    pixelSize: 0,
  },
  setInputText: (inputText) => set({ inputText }),
  setConfig: (config) => set({ config }),
}))