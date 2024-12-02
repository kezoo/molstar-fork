import React, { createRef } from 'react'
import { Button, Popconfirm, PopconfirmProps } from 'antd'
import { AiOutlineInteraction } from "react-icons/ai";
import { FaCaretDown } from "react-icons/fa";
import { HorizontalToolbarStyles } from './horizontal-toolbar-style';
import { InteractionOptions } from './InteractionOptions';

export class HorizontalToolbar extends React.Component<HorizontalToolbarProps, HorizontalToolbarState> {

  interactionOptionsRef?: InteractionOptions | null
  constructor(props: HorizontalToolbarProps) {
    super(props)

    this.state = {
      nonCovalentBonds: [
        {
          prop: 'hydrogenBonds',
          isChecked: true,
        },
        {
          prop: 'weakHBonds',
          isChecked: false,
        },
        {
          prop: 'halogenBonds',
          isChecked: true,
        },
      ],
      piInteractions: [
        {
          prop: 'piPiStakcing',
          isChecked: true,
        },
        {
          prop: 'piCations',
          isChecked: true,
        },
      ],
      selectedObjectOfInteractionProp: 'ligandReceptor',
    }
  }

  getState () {
    const refState = this.interactionOptionsRef?.state

    if (refState) {

      const nonCovalentBonds = refState.nonCovalentBonds.map(item => ({
        prop: item.prop,
        isChecked: item.isChecked,
      }))
      const piInteractions = refState.piInteractions.map(item => ({
        prop: item.prop,
        isChecked: item.isChecked,
      }))
      this.setState({
        nonCovalentBonds: [...nonCovalentBonds],
        piInteractions: [...piInteractions],
        selectedObjectOfInteractionProp: refState.selectedObjectOfInteractionProp,
      })
    }
  }

  buttons() {
    const styles = HorizontalToolbarStyles()
    const thisComp = this
    const onConfirmInteraction = () => {
      this.getState()
    }
    const buttons: ToolbarButtonProps[] = [
      {
        prop: 'interaction',
        label: 'Interaction',
        confirmablePopup: {
          title () {
            return (
              <div>3D Interaction</div>
            )
          },
          okText: 'Confirm',
          icon: null,
          onConfirm: onConfirmInteraction,
          description () {
            return (
              <InteractionOptions 
                nonCovalentBonds={thisComp.state.nonCovalentBonds}
                piInteractions={thisComp.state.piInteractions}
                selectedObjectOfInteractionProp={thisComp.state.selectedObjectOfInteractionProp}
                ref={(ref) => {
                  thisComp.interactionOptionsRef = ref
                  console.log(`interactionOptionsRef ????????? `, thisComp.interactionOptionsRef)
                }}
              />
            )
          }
        },
        icon() {
          return (
            <>
              <AiOutlineInteraction />
              <FaCaretDown />
            </>
          )
        }
      }
    ]
    return (
      <div className={`${styles.HorizontalToolbarButtons.name}`} style={styles.HorizontalToolbarButtons.css}>
        <div className={`${styles.HorizontalToolbarButtonsWp.name}`} style={styles.HorizontalToolbarButtonsWp.css}>
          {
            buttons.map((btn, btnkey) => {
              const renderBtn = () => {
                return (
                  <div
                    key={btnkey}
                    className={`${styles.HorizontalToolbarButton.name}`}
                    style={styles.HorizontalToolbarButton.css}
                  >
                    <div className={`${styles.HorizontalToolbarButtonUp.name}`}>
                      {btn.icon && btn.icon()}
                    </div>

                    <div className={`${styles.HorizontalToolbarButtonDown.name}`}>
                      <div className={`${styles.HorizontalToolbarButtonLabel.name}`}>
                        {btn.label}
                      </div>
                    </div>
                  </div>
                )
              }
              if (btn.confirmablePopup) return (
                <Popconfirm {...btn.confirmablePopup} >
                  {renderBtn()}
                </Popconfirm>
              )
              return renderBtn()
            })
          }
        </div>
      </div>
    )
  }

  render() {
    const styles = HorizontalToolbarStyles()
    return (
      <div
        className={`${styles.HorizontalToolbar.name} flex-any`}
        style={styles.HorizontalToolbar.css}
      >
        <div
          className={`${styles.HorizontalToolbarWrapper.name}`}
          style={styles.HorizontalToolbarWrapper.css}
        >
          {this.buttons()}
        </div>
      </div>
    )
  }
}

interface HorizontalToolbarState {
  nonCovalentBonds: CheckboxItem[],
  piInteractions: CheckboxItem[],
  selectedObjectOfInteractionProp: string,
}
interface HorizontalToolbarProps {

}
interface ToolbarButtonProps {
  prop: string
  label?: string
  confirmablePopup?: PopconfirmProps
  icon?: () => JSX.Element
}