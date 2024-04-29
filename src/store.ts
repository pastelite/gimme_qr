import { create } from 'zustand'
import { DrawQRConfig } from './lib/drawer'
import { CSSProperties } from 'react'


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

interface ThemeStore {
  backgroundColor: CSSProperties["color"]
  surfaceColor: CSSProperties["color"]
  behindBackgroundColor: CSSProperties["color"]
  behindBackgroundSurfaceColor: CSSProperties["color"]
  accentColor: CSSProperties["color"]

  textColor: CSSProperties["color"]
  accentTextColor: CSSProperties["color"]
  behindBackgroundTextColor: CSSProperties["color"]
  
  // secondaryAccentColor: string
  // secondaryAccentTextColor: string
  setTheme: (theme: Partial<ThemeStore>) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  backgroundColor: '#ffffff',
  textColor: '#000000',
  accentColor: '#7E69FF',
  accentTextColor: '#ffffff',
  surfaceColor: '#E4E6F5',
  behindBackgroundColor: '#C5CCFF',
  behindBackgroundSurfaceColor: '#e3e6ff',
  behindBackgroundTextColor: '#ffffff',
  setTheme: (theme) => set(theme),
}))


interface MeasurementStore {
  breakpoint: number
  setBreakpoint: (breakpoint: number) => void
}

export const useMeasurementStore = create<MeasurementStore>((set) => ({
  breakpoint: 0,
  setBreakpoint: (breakpoint) => set({ breakpoint }),
}))