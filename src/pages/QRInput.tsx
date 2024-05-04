import { BackgroundSurface } from "../components/Surface";
import { DrawQRConfig } from "../lib/drawer";
import { OptionSelector } from "../components/OptionSelector";
import { useQRCodeStore, useThemeStore } from "../store";
import { useEffect, useRef, useState } from "react";
import { TubeOptionSelector } from "../components/TubeOptionSelector";

export function QRInput() {
  const [config, setConfig, inputText, setInputText] = useQRCodeStore((state) => [state.config, state.setConfig, state.inputText, state.setInputText]);
  const theme = useThemeStore((state) => state);

  function valueChangeHandlerGenerator(name: keyof DrawQRConfig) {
    return (e: React.ChangeEvent<HTMLSelectElement>) => {
      setConfig({
        ...config,
        [name]: e.target.value as any,
      });
    };
  }

  function handleTextInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === '') {
      setInputText('Hello world!');
      return;
    }
    setInputText(e.target.value);
  }

  function handleUrlInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === '') {
      setInputText('https://qr.pstl.dev/');
      return;
    }
    setInputText(e.target.value);
  }

  const [mode, setMode] = useState('url');
  const inputBox = useRef<HTMLInputElement>(null);

  // reset input text when mode changes
  useEffect(() => {
    if (inputBox.current === null) return;

    const defaultValues = ['https://qr.pstl.dev/', 'Hello world!']
    if (!defaultValues.includes(inputBox.current.value) && inputBox.current.value !== '') {
      console.log('inputBox.current', inputBox.current.value);
      return;
    }

    if (mode === 'text') {
      setInputText('Hello world!');
      inputBox.current.value = '';
    } else {
      setInputText('https://qr.pstl.dev/');
      inputBox.current.value = 'https://qr.pstl.dev/'
    }
  }, [mode]);

  return (<BackgroundSurface gridArea='above' className='
  flex items-left justify-start md:justify-center flex-col gap-4
  h-full p-5 md:p-12 lg:p-24'>
    <TubeOptionSelector
      options={[
        { option: 'URL', value: 'url' },
        { option: 'Text', value: 'text' }
      ]}
      setter={setMode}
      value={mode}
    ></TubeOptionSelector>
    <input type="text" className='text-3xl border-b-2 py-1 border-black w-full outline-none'
      placeholder={mode === 'text' ? 'Hello world!' : 'https://qr.pstl.dev/'}
      defaultValue={mode === 'text' ? '' : 'https://qr.pstl.dev/'}
      onChange={mode === 'text'
        ? handleTextInput
        : handleUrlInput
      } ref={inputBox}></input>

    <div id="config" className="flex gap-4">
      <OptionSelector popupPage='shape' title='Shape'></OptionSelector>
      <OptionSelector popupPage='pixelSize' title='Pixel Size'></OptionSelector>
    </div>

  </BackgroundSurface>);
}
