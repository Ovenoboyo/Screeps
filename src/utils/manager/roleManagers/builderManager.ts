import { Builder } from "utils/roles/builder"
import { Manager } from "../genericManager"
import { findStorageToWithdraw } from "../storageManagers/energyStorageManager"

export class BuilderManager extends Manager {

  private generateBuilder(id: string, site: ConstructionSite) {
    const creep = Game.creeps[id]
    const storage = findStorageToWithdraw(creep, true, true, false)
    if (storage) {
      new Builder(creep, storage, site).run()
      this.usedCreeps.push(id)
    }
  }

  private assignBuilders(): string[] {
    const sites = this.room.find(FIND_CONSTRUCTION_SITES)
    if (sites.length > 0) {
      for (const id of this.creepIDs) {
        this.generateBuilder(id, sites[0])
      }
    }
    return this.unusedCreeps
  }

  public manage(): string[] {
    return this.assignBuilders()
  }
}
