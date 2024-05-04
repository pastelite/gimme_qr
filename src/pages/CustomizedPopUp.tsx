import { PopUp, OptionPopUpTemplate } from "../components/PopUp";
import { useQRCodeStore } from "../store";

export function CustomizedPopUp() {
  const [config, setConfig] = useQRCodeStore((state) => [state.config, state.setConfig]);

  return (<PopUp components={{
    shape: <OptionPopUpTemplate header='Shape' options={{
      'circle': <div>Circle</div>,
      'square': <div>Square</div>
    }} setter={key => {
      setConfig({
        ...config,
        shape: (key as any)
      });
    }} value={config.shape}></OptionPopUpTemplate>,
    pixelSize: <OptionPopUpTemplate header='pixelSize' options={{
      'small': <div>Small</div>,
      'medium': <div>Medium</div>,
      'large': <div>Large</div>
    }} setter={key => {
      setConfig({
        ...config,
        pixelSize: (key as any)
      });
    }} value={config.pixelSize.toString()}></OptionPopUpTemplate>
  }} />);
}
