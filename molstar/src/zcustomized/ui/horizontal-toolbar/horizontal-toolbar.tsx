import React from 'react'
import { Popconfirm } from 'antd'
import { HorizontalToolbarStyles } from './horizontal-toolbar-style';
import { InteractionOptions } from './InteractionOptions';
import { PluginUIComponent } from '../../../mol-plugin-ui/base';
import { HorizontalToolbarProps, HorizontalToolbarState, InteractionOptionsData, ObjectOfInteractionType, ToolbarButtonProps } from './interface';
import { getInteractionBtnConfig } from './InteractonButton';
import { StructureComponentManager } from '../../../mol-plugin-state/manager/structure/component';
import { getStructureOptions } from '../../../mol-plugin-ui/sequence';
import { Structure, StructureElement, StructureProperties } from '../../../mol-model/structure';
import { PluginStateObject as PSO } from '../../../mol-plugin-state/objects'
import { getSequence } from '../../utilities/main-utility';
import { AminoAcidList } from '../../constants/general-constant';

export class HorizontalToolbar<P = {}, S = {}, SS = {}> extends PluginUIComponent<P & HorizontalToolbarProps, S & HorizontalToolbarState, SS>  {

  interactionOptionsRef?: InteractionOptions | null
  state: S & HorizontalToolbarState  
  buttons: ToolbarButtonProps[] 
  constructor(props: P & HorizontalToolbarProps, context?: any) {
    super(props, context)
    
    const interactionBtn = getInteractionBtnConfig({
      onConfirm: () => {
        const interactionValues = interactionBtn.interactionValues as InteractionOptionsData
        const options = this.plugin.managers.structure.component.state.options
        const interactions = options.interactions
        const nKeys = Object.keys(interactions.providers)
        const arrValues = [...interactionValues.nonCovalentBonds, ...interactionValues.piInteractions]
        for (const key of nKeys) {
          const findItem = arrValues.find(fItem => fItem.apiName ===  key)
          if (findItem) {
            interactions.providers[key as 'ionic'].name = findItem.isChecked ? 'on' : 'off'
          }
        }
        options.interactions = interactions
        this.plugin.managers.structure.component.setOptions(options)
        this.handleObjectOfInteraction({objOfInteraction: interactionValues.selectedObjectOfInteractionProp})
      }
    })
    this.buttons = [
      interactionBtn.config,
    ]
  }

  handleObjectOfInteraction ({objOfInteraction}: {objOfInteraction: ObjectOfInteractionType}) {
    /* const sequence = getSequence(this.plugin);
    let union;
    sequence.forEach((item) =>
      console.log(`seq item `, item)
      item.residue.forEach((residue) => {
        console.log(`residue `, residue)
      })
    }) */
    // const structureOptions = getStructureOptions(this.plugin.state.data);
    // const structureRef = structureOptions.options[0][0];
    // const structure = this.getStructure(structureRef);

    // console.log(`data `, this.plugin.state.data)
    // console.log(`structureOptions `, structureOptions)
    // console.log(`structureRef `, structureRef)
    // console.log(`structure `, structure)
    const seqList = getSequence({plugin: this.plugin})
    console.log(`seqList `, seqList)

    let union: any
    const AminoAcidCodes = AminoAcidList.map(aItem => aItem.code)
    seqList.forEach((item) =>
      item.residue.forEach((residue) => {
        if (objOfInteraction === 'ligandReceptor') {
          return;
        }

        const location = StructureElement.Loci.getFirstLocation(residue.loci, StructureElement.Location.create(void 0));
        const ids = location && StructureProperties.residue.microheterogeneityCompIds(location);
        if (!ids) {
          return;
        }
        const fId = ids[0]
        const isAminoAcid = AminoAcidCodes.indexOf(fId.toLowerCase()) >= 0
        console.log(`${fId} isAminoAcid `, isAminoAcid)

        if (objOfInteraction === 'intraLigand' && isAminoAcid) {
          return;
        }
        if (objOfInteraction === 'intraReceptor' && !isAminoAcid) {
          return;
        }

        if (!union) {
          union = residue.loci;
          return;
        }
        union = StructureElement.Loci.union(union, residue.loci);
      }),
    );

    console.log(`union ????????????? `, union)
    if (union) {
      this.plugin.managers.structure.focus.setFromLoci(union);
    }

  }

  getStructure(ref: string) {
    const state = this.plugin.state.data;
    const cell = state.select(ref)[0];
    if (!ref || !cell || !cell.obj) return Structure.Empty;
    return (cell.obj as PSO.Molecule.Structure).data;
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
    console.log(this)
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
