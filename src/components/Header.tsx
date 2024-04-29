import { useMeasurementStore, useThemeStore } from '../store';
import ExpandMoreIcon from '../assets/material-icons/expand_more.svg?react';
import QRCodeIcon from '../assets/ux-wings/qr-code.svg?react';
import { themeBreakpoints } from '../tailwind-theme';

export function Header() {
  let theme = useThemeStore();
  let breakpoint = useMeasurementStore((state) => state.breakpoint);

  let surfaceColor = breakpoint >= themeBreakpoints['md'] ? theme.surfaceColor : theme.behindBackgroundSurfaceColor;


  return (<div className='flex absolute left-24 top-12 h-[40px] w-max shadow-none' style={{
    gridArea: 'header'
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
