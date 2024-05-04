import { BackgroundSurface } from "../components/Surface";
import { DrawQRConfig } from "../lib/drawer";
import { OptionSelector } from "../components/OptionSelector";
import { useQRCodeStore } from "../store";

export function QRInput() {
  const [config, setConfig, inputText, setInputText] = useQRCodeStore((state) => [state.config, state.setConfig, state.inputText, state.setInputText]);

  function valueChangeHandlerGenerator(name: keyof DrawQRConfig) {

    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setConfig({
        ...config,
        [name]: e.target.value as any,
      });
    };
  }

  return (<BackgroundSurface gridArea='above' className='
  flex items-left justify-start md:justify-center flex-col gap-4
  h-full p-5 md:p-12 lg:p-24'>
    <input type="text" className='text-3xl border-b-2 py-1 border-black w-full outline-none' placeholder='https://qr.pstl.dev/' onChange={e => {
      if (e.target.value === '') {
        setInputText('https://qr.pstl.dev/');
        return;
      }
      setInputText(e.target.value);
    }}></input>

    <div id="config" className="flex gap-4">
      <OptionSelector popupPage='shape' title='Shape'></OptionSelector>
      <OptionSelector popupPage='pixelSize' title='Pixel Size'></OptionSelector>
      {/* Config
      <select name="shape" id="shape" onChange={valueChangeHandlerGenerator("shape")}>
        <option value="circle">circle</option>
        <option value="square">square</option>
      </select> */}
    </div>

  </BackgroundSurface>);
}
