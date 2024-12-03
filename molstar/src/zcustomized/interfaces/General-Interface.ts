interface CheckboxItem {
  prop: string,
  apiName?: string
  isChecked: boolean,
  label?: string,
  bindingColor?: {
    color: string
  },
}
interface RadioboxItem {
  prop: string,
  label?: string,
}