import { Repairer } from "utils/roles/repairer"
import { findStorageToWithdraw } from "./energyStorageManager"

export class RepairerManager {
  private creepIDs: string[]
  private usedCreeps: string[] = []
  private structures: Structure[]

  public constructor(room: Room, creepIDs: string[]) {
    this.creepIDs = creepIDs
    this.structures = room.find(FIND_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax })
    this.structures.sort((a, b) => a.hits - b.hits)
  }

  private generateRepairer(id: string) {
    const creep = Game.creeps[id]
    const storage = findStorageToWithdraw(creep, false)
    if (storage && storage.store.energy > 0) {
      new Repairer(creep, storage, this.structures[0]).run()
      this.usedCreeps.push(id)
    }
  }

  private assignRepairers(): string[] {
    if (this.structures.length > 0) {
      for (const id of this.creepIDs) {
        this.generateRepairer(id)
      }
      return this.UnusedCreeps
    }
    return this.creepIDs
  }

  private get UnusedCreeps(): string[] {
    return this.creepIDs.filter(x => !this.usedCreeps.includes(x));
  }

  public manage(): string[] {
    return this.assignRepairers()
  }
}
