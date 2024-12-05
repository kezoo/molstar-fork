import { PopconfirmProps } from "antd"
import { HorizontalToolbar } from "./horizontal-toolbar"

export interface HorizontalToolbarState {
}
export interface HorizontalToolbarProps {

}
export interface ToolbarButtonProps {
  prop: string
  label?: string
  confirmablePopup?: PopconfirmProps
  icon?: () => JSX.Element
}
export interface ParamsForGetToolbarButtonProps {
  onConfirm?: () => void
}
export type GetToolbarButtonProps = (p?: ParamsForGetToolbarButtonProps) => {
  config: ToolbarButtonProps
  interactionValues?: InteractionOptionsData
}
export interface InteractionOptionsData {
  nonCovalentBonds: CheckboxItem[],
  piInteractions: CheckboxItem[],
  selectedObjectOfInteractionProp: ObjectOfInteractionType,
}
export type ObjectOfInteractionType = 'all' | 'ligandReceptor' | 'intraLigand' | 'intraReceptor'
