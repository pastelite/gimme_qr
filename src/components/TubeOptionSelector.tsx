import { useThemeStore } from "../store";

interface TubeOptionSelectorProps {
  options: { option: string; value: string; }[];
  setter: (value: string) => void;
  value?: string;
}
export function TubeOptionSelector({ options, setter, value: currentValue }: TubeOptionSelectorProps) {
  const theme = useThemeStore((state) => state);

  if (!currentValue) {
    currentValue = options[0].value;
  }
  // const options = ['option 1', 'option 2'];
  return (<div className="flex gap-5 px-4 rounded-full w-max" style={{
    backgroundColor: theme.surfaceColor,
    color: theme.textColor
  }}>
    {options.map((items, index) => {
      return <div className="py-2 relative z-10" key={index} style={{
        color: (items.value === currentValue) ? theme.accentTextColor : theme.textColor
      }}
        onClick={() => {
          setter(items.value);
        }}
      >
        <div className="">
          {items.option}
        </div>
        <div className="absolute top-0 bottom-0 left-[-1rem] right-[-1rem] -z-10 rounded-full" style={{
          backgroundColor: (items.value === currentValue) ? theme.accentColor : "transparent"
        }} />
      </div>;
    })}
  </div>);
}
