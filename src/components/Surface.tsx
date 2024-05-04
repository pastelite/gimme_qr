import { useThemeStore } from '../store';

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  gridArea: string;
}
export function BackgroundSurface({ children, className, style, gridArea, ...props }: SurfaceProps) {
  let theme = useThemeStore();

  return <div className={`shadow-[2px_2px_16px_rgba(0,0,0,0.1)] ${className}`} {...props} style={{
    backgroundColor: theme.backgroundColor,
    gridArea: gridArea,
    ...style
  }}>
    {children}
  </div>;
}
export function BehindBackgroundSurface({ children, style, gridArea, ...props }: SurfaceProps) {
  return <div {...props} style={{
    gridArea: gridArea,
    ...style
  }}>
    {children}
  </div>;
}
