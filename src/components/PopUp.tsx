import { closePopup, usePopupStore, useThemeStore } from "../store";
import CloseIcon from '../assets/material-icons/close.svg?react';

interface PopUpProps {
  components?: { [key: string]: React.ReactNode; };
}

export function PopUp({ components }: PopUpProps) {
  let page = usePopupStore((state) => state.page);

  return <div className="w-full h-full fixed" style={{
    pointerEvents: components && page in components ? "auto" : "none",
  }} onClick={() => {
    if (components && page in components) closePopup();
  }}>
    <div className='bg-white mx-0 md:mx-8 fixed top-[100%] left-0 right-0 
  rounded-t-[1.5rem] shadow-[0_2px_16px_rgba(0,0,0,0.25)] 
  transition-transform duration-300 ease-in-out p-8'
      style={{
        // padding: `2rem ${padding_x}px`,
        // bottom: components && !(page in components) ? "-100%" : "0",
        transform: components && page in components ? "translateY(-100%)" : "translateY(0)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {components && page in components ? components[page] : ""}
    </div>
  </div>
}

interface OptionPopUpTemplateProps {
  header: string;
  options: { [key: string]: React.ReactNode; };
  value?: string;
  setter?: (key: string) => void;
}

export function OptionPopUpTemplate({ header, options, setter, value }: OptionPopUpTemplateProps) {
  const theme = useThemeStore();

  return <div className="flex flex-col gap-5">
    <div className="flex justify-between">
      <div className='text-2xl'>{header}</div>
      <div onClick={closePopup}>
        <CloseIcon />
      </div>
    </div>
    <div className="flex justify-start gap-4">
      {Object.entries(options).map(([key, itemValue]) => {
        return <div key={key} className='bg-black/10 w-24 h-24 p-2 rounded-xl box-border'
          onClick={() => setter && setter(key)}
          style={{
            border: key == value ? `2px solid ${theme.accentColor}` : "2px solid transparent",
          }}
        >
          {itemValue}
        </div>
      })}
    </div>
  </div>
}