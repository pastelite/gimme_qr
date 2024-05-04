import { useThemeStore } from '../store';
import './Scaffold.style.css'
import { Header } from './Header';
import { BackgroundSurface, BehindBackgroundSurface } from './Surface';

export interface LayoutManagerProps {
  // above?: React.ReactNode
  // below?: React.ReactNode
  children: React.ReactNode
}

export function Scaffold({ children }: LayoutManagerProps) {
  let theme = useThemeStore();

  return (
    <div id="scaffold"
      style={{
        backgroundColor: theme.behindBackgroundColor,
        color: theme.textColor,
      }}
    >
      {children}
    </div>
  );
}

