import { Builder } from "utils/roles/builder"
import { findStorageToWithdraw } from "./energyStorageManager"

export class BuilderManager {
  private creepIDs: string[]
  private usedCreeps: string[] = []
  private sites: ConstructionSite[]

  public constructor(room: Room, creepIDs: string[]) {
    this.creepIDs = creepIDs
    this.sites = room.find(FIND_CONSTRUCTION_SITES)
  }

  private generateBuilder(id: string) {
    const creep = Game.creeps[id]
    const storage = findStorageToWithdraw(creep, false, false, false)
    if (storage) {
      new Builder(creep, storage, this.sites[0]).run()
      this.usedCreeps.push(id)
    }
  }

  private assignBuilders(): string[] {
    if (this.sites.length > 0) {
      for (const id of this.creepIDs) {
        this.generateBuilder(id)
      }
    }
    return this.UnusedCreeps
  }

  private get UnusedCreeps(): string[] {
    return this.creepIDs.filter(x => !this.usedCreeps.includes(x));
  }

  public manage(): string[] {
    return this.assignBuilders()
  }
}
