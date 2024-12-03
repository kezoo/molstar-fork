import React from 'react'
import { Popconfirm } from 'antd'
import { HorizontalToolbarStyles } from './horizontal-toolbar-style';
import { InteractionOptions } from './InteractionOptions';
import { PluginUIComponent } from '../../../mol-plugin-ui/base';
import { HorizontalToolbarProps, HorizontalToolbarState, ToolbarButtonProps } from './interface';
import { getInteractionBtnConfig } from './InteractonButton';
import { StructureComponentManager } from '../../../mol-plugin-state/manager/structure/component';

export class HorizontalToolbar<P = {}, S = {}, SS = {}> extends PluginUIComponent<P & HorizontalToolbarProps, S & HorizontalToolbarState, SS>  {

  interactionOptionsRef?: InteractionOptions | null
  state: S & HorizontalToolbarState  
  buttons: ToolbarButtonProps[] 
  constructor(props: P & HorizontalToolbarProps, context?: any) {
    super(props, context)
    
    const interactionBtn = getInteractionBtnConfig({
      onConfirm: () => {
        const options = this.plugin.managers.structure.component.state.options
        const interactions = options.interactions
        const nKeys = Object.keys(interactions.providers)
        const arrValues = [...(interactionBtn.interactionValues?.nonCovalentBonds || []), ...(interactionBtn.interactionValues?.piInteractions || [])]
        for (const key of nKeys) {
          const findItem = arrValues.find(fItem => fItem.apiName ===  key)
          if (findItem) {
            interactions.providers[key as 'ionic'].name = findItem.isChecked ? 'on' : 'off'
          }
        }
        options.interactions = interactions
        this.plugin.managers.structure.component.setOptions(options)
      }
    })
    this.buttons = [
      interactionBtn.config,
    ]
  }

  handleObjectOfInteraction () {
    /* const sequence = getSequence(this.plugin);
    let union;
    sequence.forEach((item) =>
      console.log(`seq item `, item)
      item.residue.forEach((residue) => {
        console.log(`residue `, residue)
      })
    }) */
  }

  renderButtons() {
    const styles = HorizontalToolbarStyles()
    return (
      <div className={`${styles.HorizontalToolbarButtons.name}`} style={styles.HorizontalToolbarButtons.css}>
        <div className={`${styles.HorizontalToolbarButtonsWp.name}`} style={styles.HorizontalToolbarButtonsWp.css}>
          {
            this.buttons.map((btn, btnkey) => {
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
                <Popconfirm {...btn.confirmablePopup} key={btnkey} >
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
          {this.renderButtons()}
        </div>
      </div>
    )
  }
}
