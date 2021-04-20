import { Courier } from "utils/roles/courier"
import { findStorageToWithdraw } from "./energyStorageManager"

export class CourierManager {
  private spawn: StructureSpawn
  private creepIDs: string[]
  private usedCreeps: string[] = []

  public constructor(spawn: StructureSpawn, creepIDs: string[]) {
    this.spawn = spawn
    this.creepIDs = creepIDs
  }

  private assignCouriers() {
    for (const id of this.creepIDs) {
      if (this.spawn.store.getFreeCapacity() !== 0) {
        const creep = Game.creeps[id]
        const storage = findStorageToWithdraw(creep, true) as StructureExtension
        if (storage) {
          this.usedCreeps.push(id)
          new Courier(creep, this.spawn, storage).run()
        }
      }
    }
    return this.UnusedCreeps
  }

  private get UnusedCreeps(): string[] {
    return this.creepIDs.filter(x => !this.usedCreeps.includes(x));
  }

  public manage(): string[] {
    return this.assignCouriers()
  }
}
