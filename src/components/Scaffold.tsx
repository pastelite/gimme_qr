import { useThemeStore } from '../store';
import { LayoutManagerProps } from '../App';
import './Scaffold.style.css'
import { Header } from './Header';


export function Scaffold({ above, below }: LayoutManagerProps) {
  let theme = useThemeStore();

  return (
    <div id="scaffold"
      style={{
        backgroundColor: theme.behindBackgroundColor,
        color: theme.textColor,
      }}
    >
      <Header />
      <BackgroundSurface gridArea='above'>
        {above}
      </BackgroundSurface>
      <BehindBackgroundSurface gridArea='under'>
        {below}
      </BehindBackgroundSurface>
      {/* <div id="scaffold_under">
        {below}
      </div> */}
    </div>
  );
}

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  gridArea: string
}

function BackgroundSurface({children, className, style, gridArea, ...props}:SurfaceProps) {
  let theme = useThemeStore()
  
  return <div className={`shadow-[2px_2px_16px_rgba(0,0,0,0.1)] ${className}`} {...props} style={{
    backgroundColor: theme.backgroundColor,
    gridArea: gridArea,
    ...style
  }}>
    {children}
  </div>
}

function BehindBackgroundSurface({children, style, gridArea, ...props}:SurfaceProps) {
  return <div {...props} style={{
    gridArea: gridArea,
    ...style
  }}>
    {children}
  </div>
}