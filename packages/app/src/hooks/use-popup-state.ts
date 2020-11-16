type PopupItemsMap = { [key: string]: () => boolean }

const usePopupState = (items: PopupItemsMap) => {
  const [popupState, setPopupState] = useState<number>(0)


}