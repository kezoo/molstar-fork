import { AiOutlineInteraction } from "react-icons/ai";
import { FaCaretDown } from "react-icons/fa";
import { InteractionOptions } from "./InteractionOptions";
import { GetToolbarButtonProps, InteractionOptionsData, ToolbarButtonProps } from "./interface";

export const getInteractionBtnConfig: GetToolbarButtonProps = (params) => {
  const interactionValues: InteractionOptionsData = {
    nonCovalentBonds: [
      {
        prop: 'hydrogenBonds',
        apiName: 'hydrogen-bonds',
        label: 'Hydrogen Bonds',
        isChecked: true,
        bindingColor: {
          color: '#3B7BAC',
        },
      },
      {
        prop: 'weakHBonds',
        apiName: 'weak-hydrogen-bonds',
        label: 'Weak H-Bonds',
        isChecked: false,
        bindingColor: {
          color: '#A4B7C2',
        },
      },
      {
        prop: 'halogenBonds',
        apiName: 'halogen-bonds',
        label: 'Halogen Bonds',
        isChecked: true,
        bindingColor: {
          color: '#3B7BAC',
        },
      },
    ],
    piInteractions: [
      {
        prop: 'piPiStakcing',
        apiName: 'pi-stacking',
        label: 'Pi-Pi Stacking',
        isChecked: true,
        bindingColor: {
          color: '#799858',
        },
      },
      {
        prop: 'piCations',
        apiName: 'cation-pi',
        label: 'Pi-Cations',
        isChecked: true,
        bindingColor: {
          color: '#AA5B13',
        },
      },
    ],
    selectedObjectOfInteractionProp: 'ligandReceptor'
  }
  let vRef: InteractionOptions | null = null
  const btnProp: ToolbarButtonProps = {
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
      onConfirm: () => {
        const refState = vRef?.state
        if (refState) {
          Object.assign(interactionValues, {
            nonCovalentBonds: refState.nonCovalentBonds, 
            piInteractions: refState.piInteractions, 
            selectedObjectOfInteractionProp: interactionValues.selectedObjectOfInteractionProp,
          })

          params?.onConfirm && params.onConfirm()
        }
      },
      description () {
        return (
          <InteractionOptions 
            nonCovalentBonds={interactionValues.nonCovalentBonds}
            piInteractions={interactionValues.piInteractions}
            selectedObjectOfInteractionProp={interactionValues.selectedObjectOfInteractionProp}
            ref={(ref) => {
              vRef = ref
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

  return {
    config: btnProp,
    interactionValues,
  }
}