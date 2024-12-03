import React from 'react'
import {Checkbox, Radio} from 'antd'
import { InteractionOptionsData } from './interface'

export class InteractionOptions extends React.Component<InteractionOptionsState, InteractionOptionsProps> {

  constructor (props: InteractionOptionsProps) {
    super(props)

    this.state = {
      nonCovalentBonds: [...props.nonCovalentBonds],
      piInteractions: [...props.piInteractions],
      selectedObjectOfInteractionProp: props.selectedObjectOfInteractionProp
    }
  }

  renderSubTitle ({
    title,
  }: {title: string}) {
    return (
      <div
        style={{
          fontSize: '12px',
          color: '#8f8f8f',
          margin: '1rem 0',
        }}
      >
        {title}
      </div>
    )
  }

  renderCheckboxes ({
    items, stateProp,
  }: {
    items: CheckboxItem[],
    stateProp?: InteractionOptionsStateKeys
  }) {
    const onItemClick = (item: CheckboxItem) => {
      const findItem = items.find(fItem => fItem.prop === item.prop)
      if (findItem) {
        findItem.isChecked = !item.isChecked
      }
      if (stateProp) {
        this.setState({[stateProp as 'nonCovalentBonds']: [...items]})
      }
      console.log(findItem)
    }
    return (
      <div
        style={{
          flexWrap: 'wrap',
        }}
      >
        {
          items.map((item, itemKey) => {
            return (
              <div
                key={itemKey}
                style={{
                  width: '50%',
                  marginBottom: '0.6rem',
                  alignItems: 'center',
                }}
                onClick={onItemClick.bind(this, item)}
              > 
                <Checkbox 
                  checked={item.isChecked} 
                  
                />
                <div
                  style={{
                    margin: '0 0.6rem',
                  }}
                >
                  {item.label}
                </div>
                {
                  item.bindingColor &&
                  <div
                    style={{
                      backgroundColor: item.bindingColor.color,
                      width: '8px',
                      height: '8px',
                      borderRadius: '2px',
                    }}
                  />
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  render() {
    const objectOfInteractions: RadioboxItem[] = [
      {
        prop: 'all',
        label: 'All'
      },
      {
        prop: 'ligandReceptor',
        label: 'Ligand-Receptor'
      },
      {
        prop: 'intraligand',
        label: 'Intra-Ligand'
      },
      {
        prop: 'intraReceptor',
        label: 'Intra-Receptor'
      },
    ]
    const onRadioClick = (item: RadioboxItem) => {
      this.setState({selectedObjectOfInteractionProp: item.prop})
    }
    return (
      <div className='flex-any'
        style={{
          flexDirection: 'column',
          width: '23rem',
        }}
      >
        {this.renderSubTitle({title: 'Non-covalent Bonds'})}
        {
          this.renderCheckboxes({
            items: this.state.nonCovalentBonds,
            stateProp: 'nonCovalentBonds',
          })
        }
        {this.renderSubTitle({title: 'Pi Interactions'})}
        {
          this.renderCheckboxes({
            items: this.state.piInteractions,
            stateProp: 'piInteractions',
          })
        }
        {this.renderSubTitle({title: 'Object of Interaction'})}
        <div
          style={{
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}
        >
          {
            objectOfInteractions.map((mItem, mKey) => {
              return (
                <div
                  key={mKey}
                  onClick={onRadioClick.bind(this, mItem)}
                  style={{
                    width: '50%',
                    margin: '0 0 0.4rem',
                  }}
                >
                  <Radio
                    checked={mItem.prop === this.state.selectedObjectOfInteractionProp}
                  >
                    <div>{mItem.label}</div>
                  </Radio>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

interface InteractionOptionsState extends InteractionOptionsData {
  
}

interface InteractionOptionsProps extends InteractionOptionsData {
}
type InteractionOptionsStateKeys = keyof InteractionOptionsState