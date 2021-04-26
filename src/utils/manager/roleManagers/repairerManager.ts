import { Manager } from "../genericManager"
import { Repairer } from "utils/roles/repairer"
import { findStorageToWithdraw } from "../storageManagers/energyStorageManager"

export class RepairerManager extends Manager {

  private generateRepairer(id: string, structure: Structure) {
    const creep = Game.creeps[id]
    const storage = findStorageToWithdraw(creep, true, true, false)
    if (storage && storage.store.energy > 0) {
      new Repairer(creep, storage, structure).run()
      this.usedCreeps.push(id)
    }
  }

  private assignRepairers(): string[] {
    const structures = this.room.find(FIND_STRUCTURES, { filter: (structure) => (structure.structureType === STRUCTURE_WALL && structure.hits < 10000) || (structure.structureType !== STRUCTURE_WALL && structure.hits < structure.hitsMax) })
    structures.sort((a, b) => a.hits - b.hits)

    if (structures.length > 0) {
      for (const id of this.creepIDs) {
        this.generateRepairer(id, structures[0])
      }
    }
    return this.unusedCreeps
  }

  public manage(): string[] {
    return this.assignRepairers()
  }
}
