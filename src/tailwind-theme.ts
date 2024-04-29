import resolveConfig from 'tailwindcss/resolveConfig';
//@ts-ignore
import tailwindConfig from '../tailwind.config.js'; 

export const themeConfig = resolveConfig(tailwindConfig);

export const themeBreakpoints = Object.fromEntries(Object.entries<string>(themeConfig.theme.screens).map(([key, value]) => {
  return [
    key,
    parseInt(value.replace('px', ''))
  ]
}));