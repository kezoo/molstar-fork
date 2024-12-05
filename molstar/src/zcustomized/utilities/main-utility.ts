import { Structure, StructureProperties, Unit } from "../../mol-model/structure"
import { StructureElement } from "../../mol-model/structure/structure/element"
import { PluginUIContext } from "../../mol-plugin-ui/context"
import { getChainOptions, getModelEntityOptions, getOperatorOptions, getSequenceWrapper, getStructureOptions } from "../../mol-plugin-ui/sequence"
import { SequenceWrapper } from "../../mol-plugin-ui/sequence/wrapper"

export function getSequence({ plugin }: { plugin: PluginUIContext }) {
  const stateData = plugin.state.data
  const structureOptions = getStructureOptions(stateData)
  const ref = structureOptions.options[0][0]
  const cell = stateData.select(ref)[0]
  const structure = cell.obj?.data
  const modelEntityOptions = structure.units && getModelEntityOptions(structure, false) || []
  const location = StructureElement.Location.create(void 0)
  
  console.log(`getSequenceFunc stateData `, stateData)
  
  console.log(`getSequenceFunc structureOptions `, structureOptions)
  console.log(`getSequenceFunc ref `, ref, `\ncell `, cell, `\ncellState `, cell.state, `\ncellObj `, cell.obj)
  console.log(`getSequenceFunc cell structure `, structure)
  console.log(`getSequenceFunc modelEntityOptions `, modelEntityOptions)
  console.log(`getSequenceFunc select `, stateData.select(ref))

  const gotStructure = !(!ref && structureOptions.options[0][1].match(/no structure/gi))
  const isStructureAvailable = gotStructure && !cell.state.isHidden
  const wrappers: SequenceObject[] = []
  const arrangeSeq = ({objName}: {objName: string}) => {
    for (const [modelEntityId, eLabel] of modelEntityOptions) {
      const chainOptions = getChainOptions(structure, modelEntityId)
      console.log(`getSequenceFunc chainOptions `, chainOptions)
      for (const [chainGroupId, cLabel] of chainOptions) {
        const operatorOptions = getOperatorOptions(structure, modelEntityId, chainGroupId)
        console.log(`getSequenceFunc operatorOptions `, operatorOptions)
        for (const [operatorKey] of operatorOptions) {
          const sequenceWrapper = getSequenceWrapper(
            {structure, modelEntityId, chainGroupId, operatorKey,},
            plugin.managers.structure.selection,
          )
          console.log(`getSequenceFunc sequenceWrapper `, sequenceWrapper)

          if (typeof sequenceWrapper === 'string' && sequenceWrapper.match(/no sequence/gi)) {
            continue
          }

          const sWrapper = sequenceWrapper as SequenceWrapper.Any
          const residueLabels = []
          let printFl = 0
          for (let i = 0, il = sequenceWrapper.length; i < il; ++i) {
            const label = sWrapper.residueLabel(i)
            const loci = sWrapper.getLoci(i)
            const firstLoc = StructureElement.Loci.getFirstLocation(loci, location)
            const firstLocStruModel = firstLoc && (firstLoc.structure as any).state.model
            // console.log(`firstLocStruModel `, firstLocStruModel, firstLoc)
            if (!printFl && firstLocStruModel && residueLabels.length) {
              printFl++
              console.log(`getSequenceFunc label `, label)
              console.log(`getSequenceFunc loci `, loci)
              console.log(`getSequenceFunc firstLocation `, firstLoc)
              console.log(`getSequenceFunc firstLocStruModel `, firstLocStruModel)
              console.log(`getSequenceFunc residueLabels `, residueLabels[0])
            }
            if (firstLocStruModel) {
              let seqNum = ''
              if (Unit.isAtomic(firstLoc.unit)) {
                const seqId = StructureProperties.residue.auth_seq_id(firstLoc)
                const insCode = StructureProperties.residue.pdbx_PDB_ins_code(firstLoc)
                seqNum = `${seqId}${insCode ? insCode : ''}`
              } else if (Unit.isCoarse(firstLoc.unit)) {
                seqNum = `${i + 1}`
              }
              if (seqNum) {
                const id = `${firstLoc.element}-${firstLocStruModel.id}`
                const res = {id, num: seqNum, label, loci}
                residueLabels.push(res)
              }
              
            }
          }
          wrappers.push({
            residue: residueLabels,
            name: `${objName} | ${cLabel} | ${eLabel}`,
            label: cLabel,
          })
        }
      }
    }
  }
  if (isStructureAvailable) {
    structureOptions.options.forEach((option) => {
      console.log(`getSequenceFunc option `, option)

      const idWithName = option[1].split('|', 2)
      const objName = idWithName.length > 1 ? idWithName[1] : 'Unknown'
      
      console.log(`option[1] ${option[1]} idWithName `, idWithName)
      console.log(` objName `, objName)

      arrangeSeq({objName})
    })
  }
  return wrappers
}

interface SequenceObject {
  residue: {
    id: string;
    num: string;
    label: string;
    loci: StructureElement.Loci;
  }[]
  name: string
  label: string
}