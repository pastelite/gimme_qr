import { useMeasurementStore } from "../store";
import { themeBreakpoints } from '../tailwind-theme';

function useBreakpoints(def: number, sm: number, md: number, lg: number) {
  let breakpoint = useMeasurementStore((state) => state.breakpoint);

  if (breakpoint >= themeBreakpoints['lg']) {
    return lg;
  } else if (breakpoint >= themeBreakpoints['md']) {
    return md;
  } else if (breakpoint >= themeBreakpoints['sm']) {
    return sm;
  } else {
    return def;
  }
}

export default useBreakpoints;
export function useLeftBreakpoints() {
  return useBreakpoints(24, 24, 50, 100);
}
export function useTopBreakpoints() {
  return useBreakpoints(24, 24, 50, 50);
}
// export const leftBreakpoints = useBreakpoints(24, 24, 50, 100);
// export const topBreakpoints = useBreakpoints(24, 24, 50, 50);