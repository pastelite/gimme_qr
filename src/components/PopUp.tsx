import { closePopup, usePopupStore, useThemeStore } from "../store";
import CheckIcon from '../assets/material-icons/check.svg?react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { RefObject, useRef, useState } from "react";

interface PopUpProps {
  components: { [key: string]: React.ReactNode; };
}

export function PopUp({ components }: PopUpProps) {
  let page = usePopupStore((state) => state.page);
  // let [state, setCurrentState] = useState(true);
  const refs = Object.keys(components).reduce<{ [key: string]: RefObject<HTMLDivElement> }>((acc, key) => {
    acc[key] = useRef(null);
    return acc;
  }, {});
  let defaultRef = useRef(null);
  let nodeRef = refs[page] || defaultRef;

  return <div className='bg-white mx-0 md:mx-8 fixed top-[100%] left-0 right-0 
  rounded-t-[1.5rem] shadow-[0_2px_16px_rgba(0,0,0,0.25)] 
  transition-transform duration-300 ease-in-out p-8'
    style={{
      transform: components && page in components ? "translateY(-100%)" : "translateY(0)",
    }}
  >
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={page}
        classNames="fade"
        nodeRef={nodeRef}
        timeout={100}
        onEnter={() => {
          console.log("enter")
        }}
        // @ts-ignore
        addEndListener={(node, done) => {
          // @ts-ignore
          nodeRef.current.addEventListener("transitionend", done, false);
        }}
      >
        <div ref={nodeRef}>
          {components && page in components ? components[page] :
            <OptionPopUpTemplate header="" options={{
              a: ""
            }} />
          }
        </div>
      </CSSTransition>
    </SwitchTransition>
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
    <div className="flex justify-between items-center">
      <div className='text-2xl'>{header}</div>
      <div onClick={closePopup} className="rounded-full px-4 py-2 flex items-center gap-2" style={{
        backgroundColor: theme.accentColor,
        color: theme.accentTextColor
      }}>
        Done
        <CheckIcon style={{
          fill: theme.accentTextColor,
          height: "1.5em",
          width: "1.5em",
        }} />
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