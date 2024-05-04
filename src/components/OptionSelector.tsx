import { openPopup } from "../store";

interface OptionSelectorProps {
  title: string;
  popupPage: string;
}
export function OptionSelector({ title, popupPage }: OptionSelectorProps) {
  return (<div className='grid grid-flow-row'>
    <div className='bg-black/10 w-24 h-24 p-2 rounded-xl' onClick={() => openPopup(popupPage)}>
      <div>{title}</div>
    </div>
  </div>);
}
