import { Courier } from "utils/roles/courier"
import { findStorageToWithdraw } from "./energyStorageManager"

export class CourierManager {
  private spawn: StructureSpawn
  private creepIDs: string[]

  public constructor(spawn: StructureSpawn, creepIDs: string[]) {
    this.spawn = spawn
    this.creepIDs = creepIDs
  }

  private assignCouriers() {
    for (const id of this.creepIDs) {
      new Courier(Game.creeps[id], this.spawn, findStorageToWithdraw(Game.creeps[id], true) as StructureExtension | undefined).run()
    }
    return []
  }

  public manage(): string[] {
    return this.assignCouriers()
  }
}
