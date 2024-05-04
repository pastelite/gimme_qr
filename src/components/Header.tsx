import { useMeasurementStore, useThemeStore } from '../store';
import ExpandMoreIcon from '../assets/material-icons/expand_more.svg?react';
import QRCodeIcon from '../assets/ux-wings/qr-code.svg?react';
import { themeBreakpoints } from '../tailwind-theme';
import { useLeftBreakpoints, useTopBreakpoints } from '../hooks/useBreakpoints';

export function Header() {
  let theme = useThemeStore();
  let breakpoint = useMeasurementStore((state) => state.breakpoint);

  let surfaceColor = breakpoint >= themeBreakpoints['md'] ? theme.surfaceColor : theme.behindBackgroundSurfaceColor;
  // let left = 0
  // if (breakpoint >= themeBreakpoints['lg']) {
  //   left = 100
  // } else if (breakpoint >= themeBreakpoints['md']) {
  //   left = 50
  // } else {
  //   left = 24
  // }
  // let top = 0
  // if (breakpoint >= themeBreakpoints['lg']) {
  //   top = 50
  // } else if (breakpoint >= themeBreakpoints['md']) {
  //   top = 50
  // } else {
  //   top = 24
  // }
  let left = useLeftBreakpoints()
  let top = useTopBreakpoints()
  
  return (<div className='flex absolute h-[40px] w-max shadow-none' style={{
    gridArea: 'header',
    left: `${left}px`,
    top: `${top}px`,
  }}>
    <div className='w-[40px] h-[40px] grid place-items-center' style={{
      backgroundColor: theme.accentColor,
      color: theme.accentTextColor
    }}>
      <ExpandMoreIcon fill={theme.accentTextColor} height="35px" width="35px" />
    </div>
    <div className='flex items-center gap-[6px] p-[6px] flex-1' style={{
      backgroundColor: surfaceColor,
      color: theme.textColor
    }}>
      <div className='grid place-items-center'>
        <QRCodeIcon fill={theme.textColor} height="28px" />
      </div>
      <div className='text-lg'>Gimme QR</div>
    </div>
  </div>);
}
